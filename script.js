// 等待 HTML 內容都載入完成後再執行
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 抓取所有需要的 HTML 元件 ---
    // 抓取所有畫面
    const screens = document.querySelectorAll('.screen');
    const welcomeScreen = document.getElementById('welcome-screen');
    const introScreen = document.getElementById('intro-screen');
    const questionScreen = document.getElementById('question-screen');
    const finishScreen = document.getElementById('finish-screen');

    // 抓取所有按鈕
    const startBtn = document.getElementById('start-btn');
    const startChallengeBtn = document.getElementById('start-challenge-btn');
    const submitBtn = document.getElementById('submit-btn');
    const hintBtn = document.getElementById('hint-btn');
    const restartBtn = document.getElementById('restart-btn');

    // 抓取問題區的元件
    const questionText = document.getElementById('question-text');
    const questionHint = document.getElementById('question-hint');
    const answerInput = document.getElementById('answer-input');
    const feedbackText = document.getElementById('feedback-text');

    // --- 2. 遊戲資料 ---
    [cite_start]// 基準量 (非洲象體重 [cite: 11])
    const baseAmount = 6; 
    
    [cite_start]// 題目資料 (來自課本 [cite: 9, 11, 12, 14])
    const questions = [
        {
            [cite_start]text: "第一題：抹香鯨體重是非洲象體重的幾倍？ [cite: 9]",
            [cite_start]comparisonAmount: 30, // 抹香鯨 [cite: 11]
            correctAnswer: 5,
            [cite_start]hint: "公式：比較量 ÷ 基準量 = 幾倍 [cite: 6]<br>請計算：30 ÷ 6 = ?"
        },
        {
            [cite_start]text: "第二題：鯨鯊體重是非洲象體重的幾倍？ [cite: 12]",
            [cite_start]comparisonAmount: 18, // 鯨鯊 [cite: 11]
            correctAnswer: 3,
            [cite_start]hint: "公式：比較量 ÷ 基準量 = 幾倍 [cite: 6]<br>請計算：18 ÷ 6 = ?"
        },
        {
            [cite_start]text: "第三題：犀牛體重是非洲象體重的幾倍？ [cite: 14]",
            [cite_start]comparisonAmount: 3, // 犀牛 [cite: 11]
            correctAnswer: 0.5, // 接受 0.5 或 1/2
            alternativeAnswer: "1/2",
            [cite_start]hint: "公式：比較量 ÷ 基準量 = 幾倍 [cite: 6]<br>請計算：3 ÷ 6 = ? (答案會小於1喔！)"
        }
    ];

    // 遊戲狀態變數
    let currentQuestionIndex = 0; // 追蹤目前在哪一題

    // --- 3. 核心功能函式 ---

    // 函式：切換畫面
    function showScreen(screenToShow) {
        // 隱藏所有畫面
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        // 只顯示指定的畫面
        screenToShow.classList.add('active');
    }

    // 函式：顯示特定題目
    function showQuestion(index) {
        // 從題目資料陣列中抓出目前的題目
        const question = questions[index];
        
        // 更新 HTML 上的文字
        questionText.innerText = question.text;
        questionHint.innerHTML = `<strong>提示小幫手：</strong><br>${question.hint}`;
        
        // 重置上一題的狀態
        questionHint.style.display = 'none'; // 隱藏提示
        answerInput.value = ''; // 清空作答欄
        feedbackText.innerText = ''; // 清空回饋
        feedbackText.className = ''; // 清除回饋的顏色
    }

    // 函式：檢查答案
    function checkAnswer() {
        // 取得使用者輸入的答案 (並清除前後空白)
        const userAnswer = answerInput.value.trim();
        const currentQuestion = questions[currentQuestionIndex];

        // 檢查答案 (轉成數字來比較，並檢查文字答案)
        if (parseFloat(userAnswer) === currentQuestion.correctAnswer || userAnswer === currentQuestion.alternativeAnswer) {
            // 答對了！
            feedbackText.innerText = `答對了！ ${currentQuestion.comparisonAmount} ÷ ${baseAmount} = ${currentQuestion.correctAnswer}`;
            feedbackText.className = 'correct'; // 顯示綠色
            
            // 禁用按鈕，避免重複作答
            submitBtn.disabled = true;
            hintBtn.disabled = true;

            // 延遲 1.5 秒後，自動跳到下一題
            setTimeout(() => {
                currentQuestionIndex++; // 題號 +1
                if (currentQuestionIndex < questions.length) {
                    // 還有題目，顯示下一題
                    showQuestion(currentQuestionIndex);
                    // 恢復按鈕
                    submitBtn.disabled = false;
                    hintBtn.disabled = false;
                } else {
                    // 題目都答完了，顯示結束畫面
                    showScreen(finishScreen);
                }
            }, 1500); // 1500 毫秒 = 1.5 秒

        } else {
            // 答錯了
            feedbackText.innerText = "哎呀，差一點點！再試一次看看。";
            feedbackText.className = 'incorrect'; // 顯示紅色
        }
    }

    // 函式：顯示提示
    function showHint() {
        questionHint.style.display = 'block'; // 顯示提示框
    }
    
    // 函式：重新開始遊戲
    function restartGame() {
        currentQuestionIndex = 0; // 題號歸零
        showScreen(welcomeScreen); // 回到歡迎畫面
    }

    // --- 4. 幫按鈕綁定功能 (事件監聽) ---
    
    // 按下「開始遊戲」
    startBtn.addEventListener('click', () => {
        showScreen(introScreen); // 顯示介紹畫面
    });

    // 按下「我懂了，開始挑戰！」
    startChallengeBtn.addEventListener('click', () => {
        showQuestion(0); // 顯示第一題
        showScreen(questionScreen); // 顯示問題畫面
    });

    // 按下「送出答案」
    submitBtn.addEventListener('click', checkAnswer);

    // 按下「我需要提示」
    hintBtn.addEventListener('click', showHint);

    // 按下「再玩一次」
    restartBtn.addEventListener('click', restartGame);

});
