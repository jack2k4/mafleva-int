const bcrypt = require('bcryptjs');

if (!process.stdin.isTTY || !process.stdout.isTTY) {
  console.error('Run this command in an interactive terminal so the password can be entered privately.');
  process.exit(1);
}

process.stdout.write('Admin password (input hidden): ');
process.stdin.setRawMode(true);
process.stdin.resume();
let password = '';

process.stdin.on('data', (chunk) => {
  const character = chunk.toString();
  if (character === '\u0003') process.exit(1);
  if (character === '\r' || character === '\n') {
    process.stdin.setRawMode(false);
    process.stdin.pause();
    if (password.length < 12) {
      process.stderr.write('\nUse an admin password with at least 12 characters.\n');
      process.exit(1);
    }
    process.stdout.write('\n' + bcrypt.hashSync(password, 12) + '\n');
    return;
  }
  if (character === '\u007f') {
    password = password.slice(0, -1);
    return;
  }
  password += character;
});
