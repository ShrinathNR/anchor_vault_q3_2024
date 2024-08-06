import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorVaultQ32024 } from "../target/types/anchor_vault_q3_2024";
import { expect } from "chai";

describe("anchor_vault_q3_2024", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AnchorVaultQ32024 as Program<AnchorVaultQ32024>;
  
  const [vaultState] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("state"), 
    provider.publicKey.toBytes()], 
    program.programId);
    
  const [vault] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("vault"), 
    vaultState.toBytes()], 
    program.programId);
    
  it("Initialises", async () => {
    await program.provider.connection.requestAirdrop(provider.wallet.publicKey, 1000000000);

    // Add your test here.
    const tx = await program.methods.initialize().accountsPartial(
      {
        user: provider.wallet.publicKey,
        vaultState,
        vault,
        systemProgram: anchor.web3.SystemProgram.programId,
      }
    ).rpc();
    console.log("Your transaction signature", tx);
  });

  it("Deposit", async () => {
    // Add your test here.
    const amount = new anchor.BN(500000000);
    const tx = await program.methods.deposit(amount).accountsPartial(
      {
        user: provider.wallet.publicKey,
        vaultState,
        vault,
        systemProgram: anchor.web3.SystemProgram.programId,
      }
    ).rpc();

    console.log("Your transaction signature", tx);
    expect((await provider.connection.getAccountInfo(vault)).lamports).to.be.equal(amount.toNumber());
  });

  it("Withdraw", async () => {
    // Add your test here.
    const amount = new anchor.BN(250000000);
    const tx = await program.methods.withdraw(amount).accountsPartial(
      {
        user: provider.wallet.publicKey,
        vaultState,
        vault,
        systemProgram: anchor.web3.SystemProgram.programId,
      }
    ).rpc();
    console.log("Your transaction signature", tx);
    expect((await provider.connection.getAccountInfo(vault)).lamports).to.be.equal(amount.toNumber());
  });

  it("Close", async () => {
    // Add your test here.
    const tx = await program.methods.close().accountsPartial(
      {
        user: provider.wallet.publicKey,
        vaultState,
        vault,
        systemProgram: anchor.web3.SystemProgram.programId,
      }
    ).rpc();
    console.log("Your transaction signature", tx);
    expect((await provider.connection.getAccountInfo(vault))).to.be.null;
  });
});
