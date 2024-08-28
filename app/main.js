const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const crypt0 = require("crypto");

const command = process.argv[2];

let flag = process.argv[3];
let file_path= process.argv[4];
switch (command) {

	case "init":
		createGitDirectory();
		break;
	case "cat-file":
		read_file(flag, file_path);
		break;
	case "hash-object":
		hash_object("-w", file_path);
		break;
	default:
		throw new Error(`Unknown command ${command}`);
}

function createGitDirectory() {
	fs.mkdirSync(path.join(process.cwd(), ".git"), { recursive: true });
	fs.mkdirSync(path.join(process.cwd(), ".git", "objects"), { recursive: true });
	fs.mkdirSync(path.join(process.cwd(), ".git", "refs"), { recursive: true });

	fs.writeFileSync(path.join(process.cwd(), ".git", "HEAD"), "ref: refs/heads/main\n");
	console.log("Initialized git directory");
}

function read_file(flag = null, blob) {
	let folder = blob.slice(0, 2);
	let hash = blob.slice(2);
	let content = fs.readFileSync(path.join(process.cwd(), ".git", "objects", folder, hash));

	let unzip_content = zlib.inflateSync(content);
	process.stdout.write(unzip_content.toString().split('\0')[1])
}

function hash_object(flag = null, file_name) {
	
	let file_path = path.join(process.cwd(), file_name);
	
	try
	{
		if( fs.existsSync(file_path))
		{
			let content = fs.readFileSync(file_path).toString();
			let size = content.length;
			let blob_format = `blob ${size}\0${content}`
			let hash = crypt0.createHash('sha1').update(blob_format).digest('hex')
			let compresse_file = zlib.deflateSync(Buffer.from(blob_format))
			let folder = hash.slice(0,2)
			let file = hash.slice(2)
			fs.mkdirSync(path.join(process.cwd(), ".git", "objects",folder), { recursive: true });
			fs.writeFileSync(path.join(process.cwd(), ".git", "objects",folder,file),compresse_file);
			process.stdout.write(hash)


		}

	}
	catch(err)
	{
		console.log(err)
	}
}

