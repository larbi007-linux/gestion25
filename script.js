const stock = [];

// Gestion de l'ajout de mouvements
document.getElementById('stock-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const department = document.getElementById('department').value;
  const code = document.getElementById('code').value;
  const designation = document.getElementById('designation').value;
  const quantity = parseInt(document.getElementById('quantity').value);
  const action = document.getElementById('action').value;
  const date = new Date().toLocaleString();

  // Vérifier si l'article existe déjà dans le stock
  let article = stock.find(item => item.code === code && item.department === department);

  if (action === 'entrée') {
    if (article) {
      article.stock += quantity; // Ajouter au stock existant
    } else {
      stock.push({ department, code, designation, stock: quantity, state: action, date });
    }
  } else if (action === 'sortie') {
    if (article) {
      if (article.stock < quantity) {
        alert("Stock insuffisant !");
        return;
      }
      article.stock -= quantity; // Soustraire du stock
      article.state = action;
      article.date = date; // Mettre à jour la date
    } else {
      alert("Article introuvable !");
      return;
    }
  }

  updateStockTable(); // Mettre à jour la table
  document.getElementById('stock-form').reset();
});

// Mettre à jour la table d'affichage
function updateStockTable() {
  const tableBody = document.getElementById('stock-table');
  tableBody.innerHTML = '';
  stock.forEach(item => {
    const row = `
      <tr>
        <td>${item.department}</td>
        <td>${item.code}</td>
        <td>${item.designation}</td>
        <td>${item.stock}</td>
        <td>${item.state === 'entrée' ? 'Entrée' : 'Sortie'}</td>
        <td>${item.date}</td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

// Exporter les mouvements en Excel
document.getElementById('export-button').addEventListener('click', () => {
  if (stock.length === 0) {
    alert("Aucun mouvement disponible à exporter.");
    return;
  }

  const data = stock.map(item => ({
    Département: item.department,
    Code: item.code,
    Désignation: item.designation,
    "Stock Disponible": item.stock,
    État: item.state === 'entrée' ? 'Entrée' : 'Sortie',
    Date: item.date
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Mouvements");

  XLSX.writeFile(wb, "Mouvements_Stock.xlsx");
});
