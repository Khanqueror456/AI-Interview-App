export const getDuration = (durationMs) => {

    const hours = Math.floor(durationMs / (1000 * 60 * 60));

    const minutes = Math.floor(
        (durationMs % (1000 * 60 * 60)) / (1000 * 60)
    );

    const seconds = Math.floor(
        (durationMs % (1000 * 60)) / 1000
    );

    const duration = `${hours}h ${minutes}m ${seconds}s`;
}