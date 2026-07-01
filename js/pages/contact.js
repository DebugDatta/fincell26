import { esc, shell } from '../utils.js';
import { state } from '../state.js';

export default function contact() {
  var c = state.contact;
  return shell(esc(c.title), 'Contact',
    '<div class="contact-grid grid" style="margin-top:28px"><div><p class="lead">' + esc(c.body) + '</p><div class="card value-card" style="margin-top:22px"><p><strong>Email:</strong> ' + esc(c.email) + '</p><p><strong>Address:</strong> ' + esc(c.address) + '</p><p><strong>Phone:</strong> ' + esc(c.phone || 'Available on request') + '</p></div></div><form class="card value-card form-grid" id="contactForm"><div class="field"><label>Name</label><input required></div><div class="field"><label>Email</label><input type="email" required></div><div class="field"><label>Message</label><textarea rows="5" required></textarea></div><button class="btn primary">Send Message</button></form></div>')
}
