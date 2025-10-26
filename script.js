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
    [cite_start]// 基準量 (非洲象體重: 6公噸) [cite: 1]
    const baseAmount = 6; 
    
    [cite_start]// 題目資料 (來自習作 P.92 例 1) [cite: 1]
    const questions = [
        {
            text: "第一題：抹香鯨體重是非洲象體重的幾倍？",
            [cite_start]comparisonAmount: 30, // 抹香鯨 [cite: 1]
            correctAnswer: 5, // 30 / 6 = 5
            hint: "公式：比較量 ÷ 基準量 = 幾倍<br>請計算：30 ÷ 6 = ?"
        },
        {
            text: "第二題：鯨鯊體重是非洲象體重的幾倍？",
            [cite_start]comparisonAmount: 18, // 鯨鯊 [cite: 1]
            correctAnswer: 3, // 18 / 6 = 3
            hint: "公式：比較量 ÷ 基準量 = 幾倍<br>請計算：18 ÷ 6 = ?"
        },
        {
            text: "第三題：犀牛體重是非洲象體重的幾倍？",
            [cite_start]comparisonAmount: 3, // 犀牛 [cite: 1]
            correctAnswer: 0.5, // 3 / 6 = 0.5
            alternativeAnswer: "1/2", // 接受分數作答
            hint: "公式：比較量 ÷ 基準量 = 幾倍<br>請計算：3 ÷ 6 = ? (答案會小於1喔！)"
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
        questionHint.innerHTML = `<strong>提示小幫手：</strong><br>比較量 (體重): ${question.comparisonAmount} 公噸<br>基準量 (非洲象): ${baseAmount} 公噸<br><br>${question.hint}`;
        
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
        
        // 檢查答案的精確度 (用浮點數比較)
        const isCorrect = Math.abs(parseFloat(userAnswer) - currentQuestion.correctAnswer) < 0.0001; 
        // 檢查是否是 1/2 的分數形式 (針對第三題)
        const isFractionCorrect = currentQuestion.alternativeAnswer && userAnswer === currentQuestion.alternativeAnswer;

        if (isCorrect || isFractionCorrect) {
            // 答對了！
            feedbackText.innerText = `✅ 答對了！算式：${currentQuestion.comparisonAmount} ÷ ${baseAmount} = ${currentQuestion.correctAnswer}`;
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
            }, 1500); // 1.5 秒

        } else if (parseFloat(userAnswer) * currentQuestion.comparisonAmount === baseAmount) {
            // 特別處理算反了的情況 (例如 6/30=0.2, 但使用者可能填 5)
            feedbackText.innerText = `❌ 喔喔！是不是算反了呢？您可能算成 ${baseAmount} ÷ ${currentQuestion.comparisonAmount} 了！記得用「比較量」除以「基準量」喔！`;
            feedbackText.className = 'incorrect';
        } 
        else {
            // 答錯了
            feedbackText.innerText = "❌ 沒關係，再想想看！記得要用「比較量」除以「基準量」喔！";
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
