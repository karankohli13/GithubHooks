const app = require('express')()
const bodyParser = require('body-parser')
const execFile = require('child_process').execFile

const port = 3000

app.use(bodyParser.json())


app.post('/', function(req, res) {

  var json = req.body
  var event = req.header('X-GitHub-Event')

  if (event == 'push') {

    var repo = json.repository.name
    var branch = json.ref.split('/')
    var commitID = (json.head_commit.id).substring(0, 7)
    var commitURL = json.head_commit.url
    var commitMessage = (json.head_commit.message).split('\n')[0]
    var commiterName = json.head_commit.author.username

    if (repo == 'marketsfx-vue') {
      if (branch[2] == 'master') { // To master branch
        console.log("Received hook in normal branch")
        res.status(200).send('Received update in normal server')
        console.log('Updating server...')
        execFile("./hook.sh", ['--key', 'master'], function() {
          console.log('Server updated to commit ' + commitID)

          // bot.sendMessage('general', 'Server updated to commit [#' + commitID + '](' + commitURL + ') by @' + commiterName + ' - ' + commitMessage)
        })

      } else if (branch[2] == 'testing') { // To testing branch
        console.log("Received hook in testing branch")
        res.status(200).send('OK')
        console.log('Updating testing server...')
        execFile("./hook.sh", ['--key', 'testing'], function() {
          console.log('Testing server updated to commit ' + commitID)

          // bot.sendMessage('general', 'Testing server updated to commit [#' + commitID + '](' + commitURL + ') by @' + commiterName + ' - ' + commitMessage)
        })

      } else res.status(200).send('Not modified: wrong branch')
    } else res.status(200).send('Not modified: wrong repo')

  } else if (event == 'release') {

    var version = json.release.tag_name
    var releaseInfo = (json.release.name).substring(9)

    res.status(200).send('Received update in testing server')
    console.log('New release: ' + version)

    // bot.sendMessage('general', ' ')
    // bot.sendMessage('general', '-----------------------------------------------------')
    // bot.sendMessage('general', '  New version of the website released (' + version + ')!')
    // bot.sendMessage('general', '  Release description - ' + releaseInfo)
    // bot.sendMessage('general', '-----------------------------------------------------')
    // bot.sendMessage('general', ' ')

  } else res.status(200).send('Not modified: unimplemented event')
})

app.listen(port, () => console.log('Running GitHub Webhook on port ' + port + '.'))
