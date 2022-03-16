const add = require('./testing.js')

test("2+3 must give 5", ()=>{ 
   expect(add(2,3)).toBe(5);
})