let test2 = [];
packer = new BinPack(100, 100);
test2.push(new Rect(undefined, undefined, 91, 91, 1, 1));
test2.push(new Rect(undefined, undefined, 89, 89, 2, 2));
test2.push(new Rect(undefined, undefined, 90, 90, 3, 3));
console.log(test2);

packer.addAll(test2);

if (
  JSON.stringify(packer.positioned) ==
  JSON.stringify([new Rect(0, 0, 91, 91, 1, 1)])
) {
  console.log(true);
} else {
  console.log(false);
}
