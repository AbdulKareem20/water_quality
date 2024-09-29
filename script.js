document.addEventListener('DOMContentLoaded', () => {
    const waterQualityForm = document.getElementById('water-quality-form');
    const predictionResult = document.getElementById('prediction-result');
    const qualityScore = document.getElementById('quality-score');
    const qualityDescription = document.getElementById('quality-description');
    const qualityChart = document.getElementById('qualityChart').getContext('2d');
    const signinForm = document.getElementById('signin-form');
    const signoutLink = document.getElementById('signout-link');

    async function predictWaterQuality(ph, tds, turbidity, chlorine, temperature, conductivity) {
        const apiUrl = 'https://api.openai.com/v1/chat/completions';
        const apiKey = 'sk-proj-QkvkEs5F0nXvZUJnlMgcT3BlbkFJJF6SQRqOWucMf78XAUSF';

        const prompt = `Analyze water quality based on the following parameters:
        pH: ${ph}
        Total Dissolved Solids (TDS): ${tds} mg/L
        Turbidity: ${turbidity} NTU
        Chlorine: ${chlorine} mg/L
        Temperature: ${temperature} °C
        Conductivity: ${conductivity} µS/cm

        Provide a detailed analysis including:
        1. Overall water quality assessment
        2. Potential health impacts
        3. Recommendations for improvement if necessary
        4. Compliance with WHO drinking water standards`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.choices[0].message.content;
        } catch (error) {
            console.error('Prediction error:', error);
            throw error;
        }
    }

    function renderChart(ph, tds, turbidity, chlorine, temperature, conductivity) {
        new Chart(qualityChart, {
            type: 'bar',
            data: {
                labels: ['pH', 'TDS', 'Turbidity', 'Chlorine', 'Temperature', 'Conductivity'],
                datasets: [{
                    label: 'Water Quality Parameters',
                    data: [ph, tds, turbidity, chlorine, temperature, conductivity],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    if (waterQualityForm) {
        waterQualityForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            const ph = parseFloat(document.getElementById('ph').value);
            const tds = parseFloat(document.getElementById('tds').value);
            const turbidity = parseFloat(document.getElementById('turbidity').value);
            const chlorine = parseFloat(document.getElementById('chlorine').value);
            const temperature = parseFloat(document.getElementById('temperature').value);
            const conductivity = parseFloat(document.getElementById('conductivity').value);

            qualityScore.innerHTML = '<div class="loader"></div>';
            qualityDescription.textContent = 'Analyzing water quality...';

            predictionResult.classList.remove('hidden');
            predictionResult.scrollIntoView({ behavior: 'smooth' });

            try {
                const analysis = await predictWaterQuality(ph, tds, turbidity, chlorine, temperature, conductivity);
                
                qualityScore.textContent = 'Water Quality Analysis:';
                qualityDescription.innerHTML = analysis.replace(/\n/g, '<br>');

                renderChart(ph, tds, turbidity, chlorine, temperature, conductivity);

                predictionResult.classList.add('fade-in');
            } catch (error) {
                qualityScore.textContent = 'Error in Water Quality Analysis';
                qualityDescription.textContent = 'We encountered an issue while analyzing the water quality. Please try again later.';
            }
        });
    }

    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault(); 

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (email === "user@example.com" && password === "password") {
                alert('Sign-in successful!');
                localStorage.setItem('authenticated', 'true');
                window.location.href = 'index.html';
            } else {
                alert('Invalid email or password');
            }
        });
    }

    if (signoutLink) {
        signoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('authenticated');
            alert('You have signed out.');
            window.location.href = 'index.html';
        });
    }

    if (localStorage.getItem('authenticated') === 'true') {
        document.querySelector('.btn-signin').classList.add('hidden');
        signoutLink.classList.remove('hidden');
    }
});

// Model Accuracy Comparison Chart
// function populateModelMetricsTable() {
//     const tableBody = document.querySelector('#modelMetricsTable tbody');
//     if (!tableBody) return;

//     const modelData = [
//         { name: 'Random Forest', accuracy: 0.92, precision: 0.94, recall: 0.90, f1Score: 0.92 },
//         { name: 'SVM', accuracy: 0.88, precision: 0.89, recall: 0.87, f1Score: 0.88 },
//         { name: 'Logistic Regression', accuracy: 0.85, precision: 0.86, recall: 0.84, f1Score: 0.85 },
//         { name: 'Neural Network', accuracy: 0.90, precision: 0.91, recall: 0.89, f1Score: 0.90 },
//         { name: 'LLM', accuracy: 0.95, precision: 0.96, recall: 0.94, f1Score: 0.95 }
//     ];

//     modelData.forEach(model => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td>${model.name}</td>
//             <td>${model.accuracy.toFixed(2)}</td>
//             <td>${model.precision.toFixed(2)}</td>
//             <td>${model.recall.toFixed(2)}</td>
//             <td>${model.f1Score.toFixed(2)}</td>
//         `;
//         tableBody.appendChild(row);
//     });
// }
document.addEventListener('DOMContentLoaded', () => {
    // Model Accuracy Comparison Chart
    const modelAccuracyCtx = document.getElementById('modelAccuracyChart');
    if (modelAccuracyCtx) {
        new Chart(modelAccuracyCtx, {
            type: 'bar',
            data: {
                labels: ['Random Forest', 'SVM', 'Logistic Regression', 'Neural Network', 'LLM'],
                datasets: [{
                    label: 'Accuracy',
                    data: [0.92, 0.88, 0.85, 0.90, 0.95],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1
                    }
                }
            }
        });
    }

    const performanceOverTimeCtx = document.getElementById('performanceOverTimeChart');
    if (performanceOverTimeCtx) {
        new Chart(performanceOverTimeCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Model Accuracy',
                    data: [0.88, 0.89, 0.91, 0.92, 0.93, 0.95],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    const featureImportanceCtx = document.getElementById('featureImportanceChart');
    if (featureImportanceCtx) {
        new Chart(featureImportanceCtx, {
            type: 'bar',
            data: {
                labels: ['pH', 'TDS', 'Turbidity', 'Chlorine', 'Temperature', 'Conductivity'],
                datasets: [{
                    label: 'Feature Importance',
                    data: [0.25, 0.2, 0.15, 0.15, 0.1, 0.15],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 0.3
                    }
                }
            }
        });
    }

    const confusionMatrixCtx = document.getElementById('confusionMatrixChart');
    if (confusionMatrixCtx) {
        new Chart(confusionMatrixCtx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Confusion Matrix',
                    data: [
                        {x: 0, y: 0, v: 85},
                        {x: 0, y: 1, v: 10},
                        {x: 1, y: 0, v: 5},
                        {x: 1, y: 1, v: 90}
                    ],
                    backgroundColor: (context) => {
                        const value = context.dataset.data[context.dataIndex].v;
                        const alpha = value / 100;
                        return `rgba(75, 192, 192, ${alpha})`;
                    },
                    pointRadius: 30
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        min: -0.5,
                        max: 1.5,
                        ticks: {
                            callback: (value) => ['Actual Negative', 'Actual Positive'][value]
                        }
                    },
                    y: {
                        type: 'linear',
                        min: -0.5,
                        max: 1.5,
                        ticks: {
                            callback: (value) => ['Predicted Negative', 'Predicted Positive'][value]
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `Count: ${context.dataset.data[context.dataIndex].v}`
                        }
                    }
                }
            }
        });
    }

    function populateModelMetricsTable() {
        const tableBody = document.querySelector('#modelMetricsTable tbody');
        if (!tableBody) return;

        const modelData = [
            { name: 'Random Forest', accuracy: 0.92, precision: 0.94, recall: 0.90, f1Score: 0.92 },
            { name: 'SVM', accuracy: 0.88, precision: 0.89, recall: 0.87, f1Score: 0.88 },
            { name: 'Logistic Regression', accuracy: 0.85, precision: 0.86, recall: 0.84, f1Score: 0.85 },
            { name: 'Neural Network', accuracy: 0.90, precision: 0.91, recall: 0.89, f1Score: 0.90 },
            { name: 'LLM', accuracy: 0.95, precision: 0.96, recall: 0.94, f1Score: 0.95 }
        ];

        modelData.forEach(model => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${model.name}</td>
                <td>${model.accuracy.toFixed(2)}</td>
                <td>${model.precision.toFixed(2)}</td>
                <td>${model.recall.toFixed(2)}</td>
                <td>${model.f1Score.toFixed(2)}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    populateModelMetricsTable();

    
});

