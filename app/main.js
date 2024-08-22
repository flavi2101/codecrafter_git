const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const command = process.argv[2];
switch (command)
{
	case "init":
		createGitDirectory();
		break;
	case "cat-file":
		let flag = process.argv[3];
		let sha1 = process.argv[4];
		read_file(flag,sha1);
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

function read_file(flag=null, blob)
{
	let folder = blob.slice(0,2);
	let hash = blob.slice(2);
	let content = fs.readFileSync(path.join(process.cwd(),".git","objects",folder,hash));

	let unzip_content = zlib.inflateSync(content);
	process.stdout.write(unzip_content.toString().split('\0')[1])
}	
