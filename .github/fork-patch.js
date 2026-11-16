const fs = require("fs");
const p = JSON.parse(fs.readFileSync("package.json", "utf8"));
p.author = { name: "YoruByte", email: "rahatop536@gmail.com" };
p.build.linux.target = [{ target: "pacman", arch: ["x64"] }];
p.build.pacman = { depends: ['c-ares','ffmpeg','gtk3','libevent','libvpx','libxslt','libxss','minizip','nss','re2','snappy','libnotify','libappindicator-gtk3'] };
for (const x of p.build.publish || []) x.owner = "YoruByte";
fs.writeFileSync("package.json", JSON.stringify(p, null, 2) + "\n");
const f = ".github/workflows/release.yml";
let y = fs.readFileSync(f, "utf8");
y = y.replace(/ *- os: macos-latest\n *flag: .*\n/, "");
if (!y.includes("Install bsdtar")) {
  y = y.replace(/( *)- name: Build and upload to the release/, (m, s) => s + "- name: Install bsdtar for pacman\n" + s + "  shell: bash\n" + s + "  run: if [ $RUNNER_OS = Linux ]; then sudo apt-get update && sudo apt-get install -y libarchive-tools; fi\n" + m);
}
if (y.includes("macos-latest") || !y.includes("Install bsdtar")) { console.error("release.yml changed shape, patch failed"); process.exit(1); }
fs.writeFileSync(f, y);
fs.rmSync(".github/workflows/nix-hash.yml", { force: true });
