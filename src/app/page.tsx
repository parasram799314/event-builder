// ... (rest of the code remains the same)

const handleCreate = async () => {
  if (!eventName) return;
  const payload = {
    title: eventName,
    theme: eventType.toLowerCase(),
    status: "draft",
    eventDate: startDate || null,
    eventTime: startTime || null,
    endDate: endDate || null,
    endTime: endTime || null,
    lastModifiedBy: "JD",
    domainType,
    domainValue,
    content: {
      sections: []
    }
  };
  try {
    const res = await fetch("/api/websites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const result = await res.json();
      router.push(`/editor?id=${result.id}`);
    }
  } catch (error) {
    console.error("Error creating event:", error);
  }
};

// ... (rest of the code remains the same)
