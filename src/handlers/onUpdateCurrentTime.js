import Actions from '../GameActions'

const handler = (context) => {
  context.state.currentTime = new Date()
  context.setState({currentTime: context.state.currentTime})
  setTimeout(() => {
    Actions.updateCurrentTime()
  }, 1000)
}

export default handler
