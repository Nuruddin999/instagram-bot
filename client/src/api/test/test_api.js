export const getTestSpeakers = () => new Promise((resolve, reject) => {
    let speakers = []
    for (let index = 0; index < 30; index++) {
        const element = { id: index + 1, pk: "001" + index, username: `testSpeaker ${index + 1}` }
        speakers.push(element)
    }
    console.log(JSON.stringify(speakers))
    setTimeout(() => resolve(speakers), 1300)
})