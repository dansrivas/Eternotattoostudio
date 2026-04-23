$f = Resolve-Path "index.html"
$content = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)

# Fix Diamonds in spans
$content = $content -replace '<span class="diamond[^>]*>.*?</span>', {
    param($match)
    return $match.Value -replace '(?<=>).*?(?=</span>)', '◆'
}

# Fix em-dashes and other symbols in title/meta
$content = $content -replace '<title>.*?</title>', '<title>Eterno Tattoo Studio | Culiacán — Realismo y Arte Eterno</title>'
$content = $content -replace 'content="Eterno Tattoo Studio.*?"', 'content="Eterno Tattoo Studio — Tatuajes de alta gama en Culiacán. Especialistas en realismo, blackwork y arte inmersivo por Dans y Salem. ¡Hazlo Eterno!"'

# Specific fix for card titles just in case
$content = $content -replace '¿Qué es un Flash\?', '¿Qué es un Flash?'
$content = $content -replace 'Trilogía de Línea', 'Trilogía de Línea'

[System.IO.File]::WriteAllText($f, $content, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "Fixed index.html symbols and titles."
