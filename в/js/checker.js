
const hashedKey = "177c35df8da3b40972c659ab22377938b797d51a4e3b5db74a2bd77a4a241e32"; 
async function hashInputCode(inputCode) {
    const encoder = new TextEncoder();
    const data = encoder.encode(inputCode);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}


async function checkAccessCode() {
    const accessCode = document.getElementById('access-code').value;
    const hashedInputCode = await hashInputCode(accessCode);

    if (hashedInputCode === hashedKey) {
        localStorage.setItem('accessKey', accessCode);
        document.getElementById('code-modal').style.display = 'none';
        document.getElementById('course-container').style.display = 'block'; 
        initializeModules(); 
    } else {
        alert('Неверный код доступа. Попробуйте еще раз.');
    }
}


window.onload = function() {
    const accessKey = localStorage.getItem('accessKey');


    if (!accessKey) {
        document.getElementById('code-modal').style.display = 'block';
    } else {
        document.getElementById('course-container').style.display = 'block'; 
        initializeModules(); 
    }
};


function initializeModules() {
    readJsonModules().then(loadedModules => {
        modules = loadedModules;
        initializeModuleIndicators(modules);
        initializeMeetingIndicators();
    });
}
