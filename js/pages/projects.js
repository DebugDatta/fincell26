import { shell, listBox } from '../utils.js';
import { state } from '../state.js';

export default function projects() {
  return shell('Research and projects', 'Our Work',
    '<div class="project-grid grid" style="margin-top:28px">' +
    listBox('Fundamental Research', 'Equity reports and sector analyses', state.projects.pdfs, 'No research papers uploaded yet.') +
    listBox('Quant Repositories', 'Open-source models and strategies', state.projects.repos, 'No repositories added yet.') +
    '</div>')
}
