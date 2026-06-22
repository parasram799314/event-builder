// ... (rest of the code remains the same)

const renderCountdownSettings = () => (
  <>
    <div className={styles.section}>
      <label className={styles.label}>Target Date & Time</label>
      <input
        type="datetime-local"
        className={styles.select}
        value={data.targetDate || ''}
        onChange={(e) => updateData({ ...data, targetDate: e.target.value })}
      />
    </div>
    <div className={styles.section}>
      <label className={styles.label}>Background Image</label>
      <div
        className={styles.imageUploadBox}
        style={{
          border: '2px dashed #e2e8f0',
          borderRadius: '12px',
          height: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          overflow: 'hidden',
          backgroundColor: '#f8fafc',
        }}
        onClick={() => document.getElementById('countdown-bg-input')?.click()}
      >
        <input
          type="file"
          id="countdown-bg-input"
          style={{ display: 'none' }}
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                updateData({ ...data, backgroundImage: reader.result as string });
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        {data.backgroundImage ? (
          <img
            src={data.backgroundImage}
            alt="Background"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ textAlign: 'center', color: '#94a3b8' }}>
            <i
              className="fas fa-image"
              style={{
                fontSize: '24px',
                marginBottom: '8px',
                display: 'block',
              }}
            ></i>
            <span>Upload Background</span>
          </div>
        )}
      </div>
    </div>
    <div className={styles.section}>
      <label className={styles.label}>Countdown Timer</label>
      <div className={styles.timerBox}>
        <div className={styles.timerUnit}>
          <span className={styles.timerVal}>{String(timeLeft.days).padStart(2, '0')}</span>
          <span className={styles.timerLabel}>DAYS</span>
        </div>
        <div className={styles.timerUnit}>
          <span className={styles.timerVal}>{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className={styles.timerLabel}>HOURS</span>
        </div>
        <div className={styles.timerUnit}>
          <span className={styles.timerVal}>{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className={styles.timerLabel}>MINUTES</span>
        </div>
        <div className={styles.timerUnit}>
          <span className={styles.timerVal}>{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className={styles.timerLabel}>SECONDS</span>
        </div>
      </div>
    </div>
  </>
);

// ... (rest of the code remains the same)
