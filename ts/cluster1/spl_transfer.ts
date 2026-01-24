import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../turbin3-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("FB49j23MM9rUSgQ93MfASR4rPGEAf99uBN6uhDiWjxzG");

// Recipient address
const to = new PublicKey("EJHSTa2SvsJFyDm8WvYDjWubGTLQnzFfRuSLiAPSpEf7");

const token_decimals = 1_000_000n;


(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
        );

        // Get the token account of the toWallet address, and if it does not exist, create it
        const toTokenAccount  = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            to
        );

       // 3️⃣ Transfer tokens
        const tx = await transfer(
            connection,
            keypair,
            mint,
            fromTokenAccount.address,
            toTokenAccount.address,
            keypair.publicKey,
            token_decimals
        )
        // Transfer the new token to the "toTokenAccount" we just created
        console.log("✅ Transfer successful!");
        console.log("Tx signature:", tx);

    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();