export default function(a, b, block) {
  if (a === b) {
    return block.fn(this)
  }
  return block.inverse(this)
}
