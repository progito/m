export const getTasks = async (username) => {
    try {
        const response = await fetch(`http://localhost:3001/api/alltasks/${username}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error("Ошибка при получении задач");
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};
