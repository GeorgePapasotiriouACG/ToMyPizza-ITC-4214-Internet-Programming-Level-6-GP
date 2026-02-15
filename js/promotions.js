// Simple countdown script for promotions page
(function() {
            // Set the target date for the limited time offer (e.g., 7 days from now)
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + 7); // ends in 7 days
            targetDate.setHours(23, 59, 59, 0); // end of day

            function updateCountdown() {
                const now = new Date();
                const diff = targetDate - now;

                if (diff <= 0) {
                    document.getElementById('countdown').textContent = 'Expired';
                    document.getElementById('offer-progress').style.width = '100%';
                    return;
                }

                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                document.getElementById('countdown').textContent = 
                    `${days}d ${hours}h ${minutes}m ${seconds}s`;

                // Update progress bar (assume total 7 days = 604800000 ms)
                const total = 7 * 24 * 60 * 60 * 1000;
                const elapsed = total - diff;
                const percent = Math.min(100, Math.max(0, (elapsed / total) * 100));
                document.getElementById('offer-progress').style.width = percent + '%';
            }

            // Update every second
            updateCountdown();
            setInterval(updateCountdown, 1000);
        })();