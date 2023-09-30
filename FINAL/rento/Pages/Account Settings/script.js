document.addEventListener('DOMContentLoaded', function() {
  // Επιλογή του φορμώντας HTML στοιχείου
  const form = document.querySelector('form');

  // Προσθέστε ακρόαση συμβάντος υποβολής στη φόρμα
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Ακύρωση της προεπιλεγμένης συμπεριφοράς υποβολής φόρμας

    // Δημιουργία νέου αντικειμένου FormData για τη συλλογή των δεδομένων της φόρμας
    const formData = new FormData(form);

    // Επιλέξτε το URL όπου θα σταλούν τα δεδομένα της φόρμας
    const url = 'URL_αποστολής_δεδομένων';

    // Κατασκευή αντικειμένου επιλογών για το αίτημα fetch
    const options = {
      method: 'POST',
      body: formData
    };

    // Αποστολή αιτήματος fetch για την υποβολή της φόρμας
    fetch(url, options)
      .then(function(response) {
        // Ελέγχετε την απάντηση του server
        if (response.ok) {
          console.log('Τα δεδομένα της φόρμας υποβλήθηκαν με επιτυχία!');
          // Εδώ μπορείτε να προσθέσετε τον κατάλληλο κώδικα για να επεξεργαστείτε την επιτυχημένη απάντηση
        } else {
          console.error('Σφάλμα κατά την υποβολή της φόρμας.');
          // Εδώ μπορείτε να προσθέσετε τον κατάλληλο κώδικα για την περίπτωση σφάλματος
        }
      })
      .catch(function(error) {
        console.error('Σφάλμα κατά την αποστολή του αιτήματος:', error);
        // Εδώ μπορείτε να προσθέσετε τον κατάλληλο κώδικα για την περίπτωση σφάλματος
      });
  });
});
