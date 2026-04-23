$enc = [System.Text.Encoding]::UTF8
$html = [System.IO.File]::ReadAllText("c:\Users\ingri\OneDrive\Documentos\Proyecto pagina eterno\index.html", $enc)

$promo_html = [System.IO.File]::ReadAllText("c:\Users\ingri\OneDrive\Documentos\Proyecto pagina eterno\scratch\promociones.html", $enc)
$modal_html = [System.IO.File]::ReadAllText("c:\Users\ingri\OneDrive\Documentos\Proyecto pagina eterno\scratch\modal.html", $enc)

# Replace target 1
$target1 = "  <!-- ==================== TARJETAS DE REGALO ==================== -->"
if ($html -match [regex]::Escape($target1)) {
    $html = $html.Replace($target1, "$promo_html`n$target1")
}

# Replace target 2
$target2 = "  <script src=""app.js""></script>"
if ($html -match [regex]::Escape($target2)) {
    $html = $html.Replace($target2, "$modal_html")
}

# Update colors for consistency
$html = $html.Replace("#FFD700", "#FABA20")
$html = $html.Replace("rgba(255, 215, 0,", "rgba(250, 186, 32,")
$html = $html.Replace("rgba(255,215,0,", "rgba(250,186,32,")
$html = $html.Replace("#0050ff", "#0094C6")
$html = $html.Replace("#00d2ff", "#0094C6") # Replace neon blue if any

# Save back with UTF8 NO BOM
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText("c:\Users\ingri\OneDrive\Documentos\Proyecto pagina eterno\index.html", $html, $utf8NoBom)
Write-Host "Success"
