
export function getHtmlLikeWord(content: string): string{
    const document = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            
            <style>
                body {
                    margin: 0;
                }
                    
                img {
                    max-width: 100%;
                }

                table {
                    border-collapse: collapse;
                }
                
                th, td {
                    border: 1px solid #ccc;
                    padding: 6px;
                }

                .page-break {
                    break-after: page;
                }

                .page {
                    width: 794px;
                    min-height: 1123px;

                    margin: 40px auto;

                    padding: 96px;

                    box-sizing: border-box;

                    font-family: sans-serif;
                    line-height: 1.6;

                    box-shadow: 0 0 25px 0 rgba(0, 0, 0, 0.5);
                }

                .error-text {
                    color: #ff4949eb;
                    text-align: center;
                }
            </style>
        </head>
        
        <body>
            <div class="page">
                ${content}
            </div>
        </body>

        </html>`;

    return document;
}