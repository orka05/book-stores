export const validationError = (message) => {
  const width = 420;
  const height = 420;

  // calculate center
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const popup = window.open(
    "",
    "popup",
    `width=${width},height=${height},left=${left},top=${top},scrollbars=no,resizable=no`
  );

  if (popup) {
    popup.document.write(`
      <html>
        <head>
          <title>Greška</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background: #fef2f2;
              color: #b91c1c;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              height: 100%;
              margin: 0;
            }
            .box {
              padding: 20px;
              background: white;
              text-align: center;
            }
            button {
              margin-top: 15px;
              padding: 8px 16px;
              border: none;
              background: #b91c1c;
              color: white;
              border-radius: 4px;
              cursor: pointer;
            }
            button:hover {
              background: #7f1d1d;
            }
          </style>
        </head>
        <body>
          <div class="box">
            <h2>Greška u validaciji</h2>
            <p>Sva polja moraju biti popunjena!</p>
            ${message}
          </div>
        </body>
      </html>
    `);
  }
};
