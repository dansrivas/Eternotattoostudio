const fs = require('fs');

const filepath = 'C:/Users/ingri/OneDrive/Documentos/Proyecto pagina eterno/index.html';
let content = fs.readFileSync(filepath, 'utf8');

content = content.replace(/CuliacÃ¡n/g, "Culiacán");
content = content.replace(/â€”/g, "—");
content = content.replace(/Â¡/g, "¡");
content = content.replace(/HIDRATACI"N/g, "HIDRATACIÓN");
content = content.replace(/ENCU\?NTRANOS AQUÍ/g, "ENCUÉNTRANOS AQUÍ");
content = content.replace(/C"MO LLEGAR/g, "CÓMO LLEGAR");
content = content.replace(/DISE'O/g, "DISEÑO");
content = content.replace(/\? DESCARGAR TARJETA/g, "⬇️ DESCARGAR TARJETA");

// Find specific injections
const injectedText1 = `    param($match)
    return $match.Value -replace \'(?<=>).*?(?=</span>)\', \'â—†\'
 ESPECIALES ETERNO`;
 
let start1 = content.indexOf('param($match)');
// We'll just do a more flexible replacement
content = content.replace(/\s*param\(\$match\)\s+return \$match\.Value -replace \'\(\?<=\>\)\.\*\?\(\?=\<\/span\>\)\', \'â—†\'\s+ESPECIALES ETERNO/g, 
'<span class="diamond">◆</span> ESPECIALES Y PROMOCIONES');

content = content.replace(/\s*param\(\$match\)\s+return \$match\.Value -replace \'\(\?<=\>\)\.\*\?\(\?=\<\/span\>\)\', \'â—†\'\s+CONTACTO/g, 
'<span class="diamond">◆</span> CONTACTO');

fs.writeFileSync(filepath, content, 'utf8');
console.log('Fixed encoding differences!');
