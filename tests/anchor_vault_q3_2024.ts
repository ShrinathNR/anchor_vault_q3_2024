import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorVaultQ32024 } from "../target/types/anchor_vault_q3_2024";

describe("anchor_vault_q3_2024", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AnchorVaultQ32024 as Program<AnchorVaultQ32024>;
  
  const vaultState = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("state"), 
    provider.publicKey.toBytes()], 
    program.programId)[0];
    
  const vault = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("vault"), 
    vaultState.toBytes()], 
    program.programId)[0];
    
  it("Is initialized!", async () => {
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
});
