// 初始化 LeanCloud
AV.init({
    appId: "H0RYZUGpZ6auG7Njrd4fbyWD-gzGzoHsz",
    appKey: "tenY3Ksbmgns38v74l48Symx",
    serverURL: "https://h0ryzugp.lc-cn-n1-shared.com"
});

// 初始化管理员账号
async function initAdminUser() {
    try {
        // 先尝试登录管理员账号
        try {
            await AV.User.logIn('admin', '12345');
            // 如果登录成功，说明管理员账号已存在
            await AV.User.logOut(); // 登出管理员账号
            return;
        } catch (error) {
            // 登录失败，说明管理员账号不存在，继续创建
        }

        // 创建管理员账号
        const user = new AV.User();
        user.setUsername('admin');
        user.setPassword('12345');
        user.set('role', 'admin');
        
        await user.signUp();
        console.log('管理员账号创建成功');
        // 创建成功后立即登出
        await AV.User.logOut();
    } catch (error) {
        if (error.code === 202) {
            console.log('管理员账号已存在');
        } else {
            console.error('初始化管理员账号失败：', error);
        }
    }
}

// 修改登录处理函数，添加错误详情
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const user = await AV.User.logIn(username, password);
        console.log('登录成功！', user);
        window.location.href = 'office.html';
    } catch (error) {
        console.error('登录失败：', error);
        let errorMessage = '登录失败：';
        
        switch (error.code) {
            case 210:
                errorMessage += '用户名或密码错误';
                break;
            case 211:
                errorMessage += '该用户不存在';
                break;
            case 216:
                errorMessage += '未验证邮箱';
                break;
            case 219:
                errorMessage += '登录失败次数超过限制，请稍后再试';
                break;
            default:
                errorMessage += error.message || '未知错误';
        }
        
        alert(errorMessage);
    }
    return false;
}

/**
 * 处理用户注册
 * @param {Event} event - 表单提交事件
 */
async function handleRegister(event) {
    event.preventDefault();
    
    // 禁用提交按钮，防止重复提交
    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;
    
    if (!role) {
        alert('请选择角色');
        submitButton.disabled = false;
        return;
    }
    
    try {
        // 创建新用户
        const user = new AV.User();
        user.setUsername(username);
        user.setPassword(password);
        user.set('role', role);
        
        await user.signUp();
        
        // 注册成功后的处理
        alert('注册成功！请登录');
        
        // 清空表单
        document.getElementById('registerFormElement').reset();
        
        // 切换到登录表单并填充用户名
        toggleForms();
        document.getElementById('loginUsername').value = username;
        
    } catch (error) {
        console.error('注册失败：', error);
        let errorMessage = '注册失败：';
        
        switch (error.code) {
            case 202:
            case 203:
                errorMessage += '用户名已被占用';
                break;
            case 214:
                errorMessage += '手机号码已被占用';
                break;
            case 201:
                errorMessage += '密码不能为空';
                break;
            default:
                errorMessage += error.message || '未知错误';
        }
        
        alert(errorMessage);
    } finally {
        // 恢复提交按钮
        submitButton.disabled = false;
    }
}

/**
 * 切换登录和注册表单的显示
 */
function toggleForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

// 在页面加载完成后初始化管理员账号
document.addEventListener('DOMContentLoaded', async function() {
    await initAdminUser();
    
    // 使用表单的id来绑定事件
    const registerForm = document.getElementById('registerFormElement');
    const loginForm = document.getElementById('loginForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}); 