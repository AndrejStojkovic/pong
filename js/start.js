function startGame(num) {
    var all = document.getElementsByClassName("main-menu")[0];
    all.style.display = 'none';

    var startTab = document.getElementById('startTab');
    startTab.style.display = 'none';

    var optionTab = document.getElementById('optionTab');
    optionTab.style.display = 'none';

    var aboutTab = document.getElementById('aboutTab');
    aboutTab.style.display = 'none';

    mode(num);
}

function startTab() {
    var startTab = document.getElementById('startTab');
    startTab.style.display = 'block';
}

function optionTab() {
    var optionTab = document.getElementById('optionTab');
    optionTab.style.display = 'block';
}

function ctrlsTab() {
    var ctrlsTab = document.getElementById('ctrlsTab');
    ctrlsTab.style.display = 'block';
}

function aboutTab() {
    var aboutTab = document.getElementById('aboutTab');
    aboutTab.style.display = 'block';
}

function closeTab() {
    var startTab = document.getElementById('startTab');
    startTab.style.display = 'none';

    var optionTab = document.getElementById('optionTab');
    optionTab.style.display = 'none';

    var aboutTab = document.getElementById('aboutTab');
    aboutTab.style.display = 'none';

    var ctrlsTab = document.getElementById('ctrlsTab');
    ctrlsTab.style.display = 'none';
}