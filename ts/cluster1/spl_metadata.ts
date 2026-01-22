import wallet from "../turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";


// Mint address
const mint =  publicKey("FB49j23MM9rUSgQ93MfASR4rPGEAf99uBN6uhDiWjxzG");

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));

const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Start here
        const accounts: CreateMetadataAccountV3InstructionAccounts = {
         mint,
         mintAuthority: signer
    }

         const data: DataV2Args = {
            name: "Turbin3 Token",
            symbol: "TBT",
            uri: "https://www.turbin3.com",
            sellerFeeBasisPoints: 1000,
            creators: null,
            collection: null,
            uses: null
         }

        const args: CreateMetadataAccountV3InstructionArgs = {
            data,
            isMutable: true,
            collectionDetails: null,
        }

        const tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )

        const result = await tx.sendAndConfirm(umi);
        console.log(`Metadata created: ${bs58.encode(result.signature)}`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
