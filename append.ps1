$cssPath = "c:\Users\ingri\OneDrive\Documentos\Proyecto pagina eterno\styles.css"
$missingPath = "c:\Users\ingri\OneDrive\Documentos\Proyecto pagina eterno\missing.css"
$content = Get-Content $missingPath -Raw
Add-Content -Path $cssPath -Value $content
Write-Host "Appended successfully"
