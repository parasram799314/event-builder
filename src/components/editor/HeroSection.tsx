// ... (rest of the code remains the same)

const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

// ... (rest of the code remains the same)

useEffect(() => {
  const calculateTimeLeft = () => {
    const target = new Date(dateTimeSettings.eventDate).getTime();
    const now = new Date().getTime();
    const difference = target - now;
    if (difference > 0) {
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    } else {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    }
  };
  calculateTimeLeft();
  const timer = setInterval(calculateTimeLeft, 1000);
  return () => clearInterval(timer);
}, [dateTimeSettings.eventDate]);

// ... (rest of the code remains the same)

<div className={`editable-element ${styles.eventMeta}`} style={{ width: '100%' }}>
  {!isReadOnly && <EditToolbar isVisible={visibility.meta} onToggleVisibility={toggleVisibility('meta')} onSettingsClick={openHeroSettings} />}
  {visibility.meta ? (
    <div
      style={{
        display: 'flex',
        gap: '32px',
        color: slideStyles.meta.color,
        justifyContent: (slide.textAlignment === 'center' ? 'center' : slide.textAlignment === 'right' ? 'flex-end' : 'flex-start') as any,
        flexWrap: 'wrap',
        width: '100%',
      }}
    >
      {dateTimeSettings.showDate && (
        <div className={styles.metaItem} style={{ color: 'inherit' }}>
          {dateTimeSettings.showIcons && <span className={styles.icon} style={{ color: slideStyles.badge.color }}></span>}
          <span>{isMounted ? new Date(dateTimeSettings.eventDate).toLocaleDateString() : ''}</span>
        </div>
      )}
      {dateTimeSettings.showTime && (
        <div className={styles.metaItem} style={{ color: 'inherit' }}>
          {dateTimeSettings.showIcons && <span className={styles.icon} style={{ color: slideStyles.badge.color }}></span>}
          <span>{isMounted ? new Date(dateTimeSettings.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
        </div>
      )}
      {dateTimeSettings.showVenue && (
        <div className={styles.metaItem} style={{ color: 'inherit' }}>
          {dateTimeSettings.showIcons && <span className={styles.icon} style={{ color: slideStyles.badge.color }}></span>}
          <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => updateData({ ...data, dateTimeSettings: { ...dateTimeSettings, venueText: e.target.innerText } })}>
            {dateTimeSettings.venueText}
          </span>
        </div>
      )}
      {visibility.countdown && (
        <div className={styles.countdownBox}>
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
      )}
    </div>
  ) : null}
</div>

// ... (rest of the code remains the same)
