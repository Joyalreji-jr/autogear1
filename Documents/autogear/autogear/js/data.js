// Edit this file to add / change parts. Prices are in ₹ (excluding 18% GST).
// Product photos are cropped from images/parts.jpg:
//   z   = zoom (% of image width), pos = focus point "x% y%".
// For a real photo per product, swap the crop for an `img: 'images/xyz.jpg'` field.
const IMG = 'images/parts.jpg';

// Admin login. Default: user "admin", password "Admin@123".
// To change the password, make a new hash and paste it below:
//   node -e "console.log(require('crypto').createHash('sha256').update('YOUR_PASSWORD').digest('hex'))"
const ADMIN_USER = 'admin';
const ADMIN_HASH = 'e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7';

const CATS = ['Alloy Wheels', 'Exhaust Systems', 'Body Kits', 'Suspension', 'Engine Performance', 'Brakes', 'Lighting'];

const PRODUCTS = [
  { id: 1, name: '57DR Alloy Wheels 18"',        brand: 'Rays',      cat: 'Alloy Wheels',       price: 24999, old: 27999, stock: 5,  z: 300, pos: '92% 49%' },
  { id: 2, name: 'Slip-On Exhaust System',       brand: 'Akrapovič', cat: 'Exhaust Systems',    price: 89999,              stock: 3,  z: 200, pos: '80% 90%' },
  { id: 3, name: 'Carbon GT Wing Body Kit',      brand: 'Varis',     cat: 'Body Kits',          price: 54999,              stock: 4,  z: 200, pos: '80% 10%' },
  { id: 4, name: 'Flex Z Coilovers',             brand: 'Tein',      cat: 'Suspension',         price: 76999,              stock: 2,  icon: '🔩' },
  { id: 5, name: 'GT Brake Kit',                 brand: 'Brembo',    cat: 'Brakes',             price: 62999,              stock: 6,  z: 300, pos: '4% 47%' },
  { id: 6, name: 'Turbo Air Intake System',      brand: 'K&N',       cat: 'Engine Performance', price: 34999,              stock: 8,  z: 300, pos: '45% 53%' },
  { id: 7, name: 'LED Projector Headlight',      brand: 'Morimoto',  cat: 'Lighting',           price: 28999, old: 31999, stock: 7,  z: 300, pos: '3% 76%' },
  { id: 8, name: 'Racing Spark Plugs (Set of 4)', brand: 'HKS',      cat: 'Engine Performance', price: 3499,               stock: 20, z: 400, pos: '63% 87%' }
];

// Sample sales bills so the admin page is not empty. New orders are saved in the browser (localStorage).
const SEED_BILLS = [
  { no: 'INV-1001', date: '2026-10-18', customer: 'Arun Menon', phone: '98765 43210',
    items: [{ name: '57DR Alloy Wheels 18"', qty: 1, price: 24999 }, { name: 'Racing Spark Plugs (Set of 4)', qty: 1, price: 3499 }] },
  { no: 'INV-1002', date: '2026-10-22', customer: 'Sanjay Thomas', phone: '91234 56780',
    items: [{ name: 'GT Brake Kit', qty: 1, price: 62999 }] },
  { no: 'INV-1003', date: '2026-10-25', customer: 'Fahad Ali', phone: '99887 76655',
    items: [{ name: 'Slip-On Exhaust System', qty: 1, price: 89999 }, { name: 'LED Projector Headlight', qty: 2, price: 28999 }] }
];
