module.exports = (css) => {
    const sheet = document.createElement('style');
    sheet.innerHTML = css;
    document.head.appendChild(sheet); 
}