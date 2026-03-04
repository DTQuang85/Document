// ================================================
// VNEXPRESS PHISHING DEMO - JAVASCRIPT
// Mon An toan Ung dung Web
// ================================================

(function() {
    // === STATE ===
    var loggedIn = false;
    var currentUser = '';
    var hasShownRansom = false;
    var timerInterval = null;
    
    // === HELPER ===
    function $(id) { 
        return document.getElementById(id); 
    }
    
    // === VALIDATE EMAIL ===
    function isValidEmail(email) {
        return email.indexOf('@') !== -1 && email.indexOf('.') !== -1;
    }
    
    // === LUU THONG TIN ===
    function saveCredentials(user, pass) {
        var data = {
            email: user,
            password: pass,
            time: new Date().toLocaleString('vi-VN'),
            userAgent: navigator.userAgent
        };
        
        var logs = JSON.parse(localStorage.getItem('phishing_logs') || '[]');
        logs.push(data);
        localStorage.setItem('phishing_logs', JSON.stringify(logs));
        
        console.log('%c=== THONG TIN DA BI DANH CAP ===', 'color: red; font-size: 16px; font-weight: bold;');
        console.log('%cEmail: ' + user, 'color: orange;');
        console.log('%cPassword: ' + pass, 'color: orange;');
        console.log('%cTime: ' + data.time, 'color: gray;');
        console.log('%c================================', 'color: red;');
    }
    
    // Xem logs
    window.viewLogs = function() {
        var logs = JSON.parse(localStorage.getItem('phishing_logs') || '[]');
        console.table(logs);
        alert('Da luu ' + logs.length + ' tai khoan. Xem trong Console (F12)');
    };
    
    window.clearLogs = function() {
        localStorage.removeItem('phishing_logs');
        console.log('Da xoa tat ca logs');
    };
    
    // === ALARM SOUND - Am thanh canh bao ===
    var alarmAudio = null;
    
    function playAlarmSound() {
        try {
            alarmAudio = new Audio('images/pipip.mp3');
            alarmAudio.loop = true;
            alarmAudio.volume = 0.7;
            alarmAudio.play();
        } catch(e) {
            console.log('Audio not supported');
        }
    }
    
    function stopAlarmSound() {
        if (alarmAudio) {
            alarmAudio.pause();
            alarmAudio.currentTime = 0;
            alarmAudio = null;
        }
    }
    
    // === RANSOMWARE POPUP ===
    function generateSessionId() {
        var chars = 'ABCDEF0123456789';
        var result = '';
        for (var i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    window.showRansomWarning = function() {
        if (!loggedIn) {
            alert('Vui long dang nhap!');
            return;
        }
        
        // Hien email bi danh cap
        var emailEl = $('stolenEmail');
        if (emailEl) emailEl.textContent = currentUser;
        
        // Tao va hien Session ID
        var sessionEl = $('sessionId');
        if (sessionEl) sessionEl.textContent = generateSessionId();
        
        // Hien popup
        var popup = $('ransomPopup');
        if (popup) popup.style.display = 'flex';
        
        // Phat am thanh canh bao
        playAlarmSound();
        
        hasShownRansom = true;
    };
    
    window.closeRansom = function() {
        var popup = $('ransomPopup');
        if (popup) popup.style.display = 'none';
        
        // Tat am thanh
        stopAlarmSound();
        
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        
        // Hien popup thong tin nhom
        showGroupInfo();
    };
    
    function startCountdown() {
        var hours = 23, mins = 59, secs = 59;
        var timerEl = $('ransomTimer');
        
        if (timerInterval) clearInterval(timerInterval);
        
        timerInterval = setInterval(function() {
            secs--;
            if (secs < 0) { secs = 59; mins--; }
            if (mins < 0) { mins = 59; hours--; }
            if (hours < 0) { hours = 0; mins = 0; secs = 0; }
            
            if (timerEl) {
                timerEl.textContent = 
                    String(hours).padStart(2, '0') + ':' + 
                    String(mins).padStart(2, '0') + ':' + 
                    String(secs).padStart(2, '0');
            }
        }, 1000);
    }
    
    // === MAIN FUNCTIONS ===
    window.showLogin = function() {
        var m = $('loginModal');
        if (m) m.style.display = 'flex';
    };
    
    window.hideLogin = function() {
        // Khong cho dong
    };
    
    window.logout = function() {
        loggedIn = false;
        currentUser = '';
        hasShownRansom = false;
        
        var a = $('loginBtnHeader');
        var b = $('userInfo');
        var c = $('contentSection');
        var d = $('newsImage');
        var e = $('infoPopup');
        var f = $('loginForm');
        var g = $('ransomPopup');
        
        if (a) a.style.display = 'block';
        if (b) b.style.display = 'none';
        if (c) c.style.display = 'none';
        if (d) d.style.display = 'none';
        if (e) e.style.display = 'none';
        if (f) f.reset();
        if (g) g.style.display = 'none';
        
        showLogin();
    };
    
    window.showGroupInfo = function() {
        if (loggedIn) {
            var p = $('infoPopup');
            if (p) p.style.display = 'flex';
            
            // Play video khi popup hien
            var video = $('helloVideo');
            if (video) {
                video.currentTime = 0;
                video.play();
            }
        } else {
            alert('Vui long dang nhap!');
        }
    };
    
    window.closeInfo = function() {
        var p = $('infoPopup');
        if (p) p.style.display = 'none';
        
        // Pause video khi dong popup
        var video = $('helloVideo');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    };
    
    // Khi click bai bao -> hien ransomware lan dau, sau do hien thong tin nhom
    window.onArticleClick = function() {
        if (!loggedIn) {
            alert('Vui long dang nhap!');
            return;
        }
        
        if (!hasShownRansom) {
            showRansomWarning();
        } else {
            showGroupInfo();
        }
    };
    
    window.handleLogin = function(e) {
        if (e) e.preventDefault();
        
        var uEl = $('username');
        var pEl = $('password');
        var errorEl = $('errorMsg');
        
        if (!uEl || !pEl) return;
        
        var user = uEl.value.trim();
        var pass = pEl.value.trim();
        
        // Validate
        if (!user || !pass) {
            alert('Vui long nhap day du thong tin!');
            return;
        }
        
        // Kiem tra email phai co @
        if (!isValidEmail(user)) {
            if (errorEl) {
                errorEl.textContent = 'Email khong hop le! Vui long nhap dung dinh dang email.';
                errorEl.style.display = 'block';
            }
            return;
        }
        
        // An loi neu co
        if (errorEl) errorEl.style.display = 'none';
        
        // LUU THONG TIN DANG NHAP
        saveCredentials(user, pass);
        
        currentUser = user;
        loggedIn = true;
        hasShownRansom = false;
        
        // Update UI
        var modal = $('loginModal');
        var content = $('contentSection');
        var img = $('newsImage');
        var loginBtn = $('loginBtnHeader');
        var userInfo = $('userInfo');
        var displayName = $('displayUsername');
        var form = $('loginForm');
        
        if (modal) modal.style.display = 'none';
        if (content) content.style.display = 'block';
        if (img) img.style.display = 'block';
        if (loginBtn) loginBtn.style.display = 'none';
        if (userInfo) userInfo.style.display = 'block';
        if (displayName) displayName.textContent = user;
        if (form) form.reset();
    };
    
    // === INIT ===
    document.addEventListener('DOMContentLoaded', function() {
        showLogin();
        console.log('%c Go viewLogs() de xem tai khoan da luu', 'color: green;');
        console.log('%c Go clearLogs() de xoa', 'color: orange;');
    });
})();
