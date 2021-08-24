import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import LessonPanel from './components/LessonPanel'
import Booking from './components/Booking'
import AvailabilityPanel from './components/AvailabilityPanel';

function App() {


  return (
    <div className="App">
      <div className="test">
        <Router basename={'admin'}>
          <div className="wrapper">
            <Sidebar />
            <div className="content-wrapper">
              <div className="container-fluid">
                <Switch>
                  <Route path="/appointment">
                    <Appointment />
                  </Route>
                  <Route path="/lesson">
                    <LessonPanel />
                  </Route>
                  <Route path="/availability">
                    <AvailabilityPanel />
                  </Route>
                  <Route path="/upload">
                    <Upload />
                  </Route>
                  <Route path="/booking">
                    <Booking />
                  </Route>
                  <Route path="/logout">
                    <Logout />
                  </Route>
                </Switch>
              </div>
            </div>
          </div>

        </Router>
      </div>
    </div>
  );
}

function Appointment() {
  return (
    <div>
      Appointment
    </div>
  )
}

function Availability() {
  return (
    <div>
      Availability
    </div>
  )
}
function Upload() {
  return (
    <div>
      Upload
    </div>
  )
}
function Logout() {
  return (
    <div>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget erat tempus, interdum purus ut, tristique risus. In ultricies viverra volutpat. Curabitur tellus dolor, eleifend non mattis ac, accumsan sed lacus. Nam facilisis convallis leo vestibulum malesuada. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed consectetur ante aliquet augue finibus, id auctor risus eleifend. Proin aliquet et dui non fringilla. Cras eu lectus massa. Vestibulum ultrices, nisi in sollicitudin pellentesque, dolor magna hendrerit odio, dapibus mollis augue urna a risus. Sed egestas lobortis volutpat. Pellentesque erat nisi, laoreet vitae tincidunt sed, tincidunt nec lectus. Etiam rutrum lorem id urna placerat pellentesque. Mauris sollicitudin, urna sit amet aliquet convallis, sapien tellus placerat tellus, venenatis ullamcorper dolor lorem quis ex.

      Aliquam sodales enim luctus enim condimentum aliquam. Duis et mattis orci, nec suscipit turpis. In hac habitasse platea dictumst. Quisque porttitor lorem interdum, pretium est at, auctor urna. Aenean pharetra turpis libero, et tempus sem finibus eu. Ut non aliquet nibh. Quisque a pharetra sem. Mauris vel tristique arcu.

      Proin faucibus ultricies sem at pharetra. Proin at magna sed orci cursus elementum. Donec quis tellus ac nunc pharetra congue sed id odio. Sed pharetra sed mi a dictum. Integer sit amet magna vulputate, mollis dui non, tristique leo. Nunc rutrum sapien auctor diam vulputate eleifend. Morbi sit amet tincidunt augue, in semper orci. Nulla vitae iaculis arcu. Aenean eu dictum urna, non dapibus dui. Sed accumsan nunc id orci varius ullamcorper. Donec ut lectus nec diam sagittis pretium eu eu ante. Suspendisse interdum est ante. Vestibulum cursus odio mi. Sed nisl elit, egestas vel porttitor eu, commodo nec sem. Mauris vitae risus vel purus hendrerit luctus eget a sapien.

      Nullam ornare orci ex, dapibus mattis turpis rhoncus non. In tincidunt quam et est elementum, quis cursus purus aliquet. Etiam vel suscipit libero, sagittis rutrum nulla. Proin rhoncus enim suscipit, accumsan tellus ut, eleifend dolor. Curabitur urna enim, consectetur quis ex quis, pellentesque consequat risus. Praesent elit libero, tincidunt eu nunc non, porta rhoncus orci. Nam ligula augue, mattis vitae sapien nec, sodales hendrerit sem. Aenean lacus lectus, molestie a dictum id, porta eget urna.

      Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Pellentesque vitae augue eget eros fringilla tincidunt. Fusce fringilla dolor at metus semper, volutpat viverra orci euismod. Praesent eu suscipit justo. In hac habitasse platea dictumst. Cras a erat sit amet diam ultricies egestas et at quam. Maecenas venenatis, quam et eleifend blandit, ante erat sodales justo, eget consectetur nibh orci sit amet lorem. Aliquam consequat sagittis turpis sed posuere.

      Donec a urna finibus sem auctor aliquet et porttitor lectus. Nullam eu pulvinar neque, at tristique neque. Aliquam at nibh justo. Vestibulum a massa faucibus arcu vestibulum tempor eu ac felis. Aliquam egestas ipsum sed rhoncus sodales. Aenean auctor lorem tellus, nec tincidunt sem mattis quis. In ipsum ipsum, sodales eget venenatis non, laoreet at metus. Morbi accumsan dolor ac neque egestas sagittis. Pellentesque quis enim sapien. Mauris ultrices sapien at maximus efficitur. Pellentesque pharetra erat in elit tempus sollicitudin. Integer luctus, erat eu consequat aliquet, magna urna euismod ex, sit amet sollicitudin sapien purus et ex. Suspendisse cursus dolor in quam ullamcorper mollis. Duis vel enim nec ex lobortis ultricies. Sed sed lorem nec neque maximus congue ac ac nisi. Phasellus vehicula lorem purus, quis interdum eros venenatis vitae.

      Integer arcu massa, ullamcorper sit amet magna non, volutpat dictum risus. Etiam non luctus enim. Praesent aliquet libero arcu, vel vehicula justo eleifend quis. Praesent ac diam dui. Proin feugiat nisl neque, non suscipit mi ultricies vitae. Quisque dapibus consectetur venenatis. Vestibulum rutrum, erat ut facilisis mattis, nulla arcu gravida erat, sed molestie nisi lacus eu eros. Duis iaculis tortor nec lectus molestie, at pharetra risus faucibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam varius aliquam turpis et placerat. Cras ut magna id ipsum euismod cursus. Nunc varius ipsum justo, ac placerat lorem tincidunt et. Ut non fermentum arcu. Phasellus sed consequat dui.

      Aenean in purus blandit, fringilla sapien id, scelerisque tortor. Nam et sem aliquam, mattis nisi eu, ultrices leo. Suspendisse eget libero congue nunc consequat convallis vitae et tortor. Vestibulum massa massa, imperdiet eleifend ullamcorper in, tristique nec mauris. Pellentesque ullamcorper augue ipsum. Praesent consectetur tincidunt lobortis. Cras et euismod tortor. Donec volutpat tellus eu vulputate mollis. In id pharetra ante.

      Nulla dapibus orci nec ligula congue aliquet. Sed convallis orci ut nisl tristique, ut mattis nisi rhoncus. Etiam at leo eu lectus dignissim bibendum non eu nisl. Fusce dapibus eget ligula eget tincidunt. Sed quis faucibus velit, nec eleifend mauris. Donec sit amet leo sed sapien dictum pharetra. Praesent mollis commodo orci, ac condimentum mauris porttitor facilisis. Sed venenatis ligula quis lorem placerat lobortis. Nulla id turpis eu ante malesuada pretium ut malesuada neque. Nunc fringilla felis leo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.

      Aliquam tincidunt, nulla quis rhoncus ornare, massa mi pharetra neque, vitae congue erat sem eget libero. Proin ac egestas neque, eget pulvinar erat. Donec dui urna, bibendum sit amet diam eget, semper sagittis erat. Vivamus porttitor velit quis sodales ultricies. In quis iaculis sem, in dapibus nulla. Suspendisse potenti. Sed venenatis tellus nec cursus ullamcorper. Duis luctus ultricies iaculis.

      Fusce molestie dignissim rhoncus. Ut sed bibendum ligula. Donec nec nibh turpis. Mauris porta bibendum nisi, a dapibus nisi pretium id. Curabitur maximus purus eu metus blandit, eu eleifend nibh mattis. Curabitur tristique imperdiet ligula, a convallis felis ultrices sit amet. Nulla nec imperdiet ipsum. Sed tincidunt hendrerit turpis sed vestibulum. Vivamus fermentum egestas bibendum. Vivamus blandit dui vitae lacus porttitor, in congue ante rhoncus. Aenean nulla odio, convallis dapibus viverra at, fringilla et nulla. Praesent id augue quam. Nam et ante eget ex egestas commodo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam consectetur, mauris eget faucibus condimentum, libero eros placerat ligula, sed tincidunt turpis ligula eget dui.

      Mauris elementum commodo lectus vitae tincidunt. Donec porttitor purus lacinia sem dignissim tincidunt. Aenean gravida, quam congue sodales condimentum, lorem nisi laoreet ligula, vel scelerisque massa orci eu urna. Fusce ultrices massa sem, sed vehicula nisi efficitur non. Sed porta mattis enim a volutpat. Mauris nec auctor lacus, ut interdum massa. Etiam ut blandit augue. Donec tempor metus non neque lobortis ultricies. Pellentesque a tortor eget libero congue volutpat. Aenean vitae nisl accumsan, pretium leo et, eleifend sem. Sed viverra libero in augue dapibus, et vestibulum ex tincidunt.

      Proin faucibus hendrerit magna quis pellentesque. Quisque nunc orci, bibendum cursus sagittis id, consequat gravida dui. Integer tempus turpis ac neque pretium luctus. Proin accumsan lacus vel eros dignissim, quis feugiat orci pulvinar. Morbi cursus feugiat nisl feugiat scelerisque. In id aliquam urna, non rhoncus ipsum. Phasellus mollis commodo diam, eu posuere velit suscipit at. Praesent tortor sapien, suscipit a dictum non, volutpat rutrum lacus. Duis sit amet libero eu lacus hendrerit lacinia ac a ligula. Morbi sed risus ultricies, bibendum turpis vel, auctor enim. Nullam auctor eros a justo varius cursus. Pellentesque iaculis odio sed ligula egestas, at pulvinar lectus interdum. Vivamus maximus turpis a hendrerit dignissim.

      Nunc enim nisl, sagittis quis congue et, tempus ut neque. Donec congue at est sit amet tempus. Sed ut feugiat tortor. Aliquam sit amet sollicitudin diam, quis congue dui. Nulla egestas ante ut dolor tincidunt, vitae molestie purus maximus. Suspendisse ut nunc sollicitudin, dictum dolor ut, tincidunt arcu. Duis pellentesque, libero luctus dapibus mollis, lacus ante scelerisque nulla, id dignissim erat odio in nibh. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum vulputate ultricies ultricies. Phasellus auctor orci ac urna lacinia maximus. Integer velit mauris, luctus eu nibh id, egestas ultrices est. Nam malesuada laoreet faucibus. Donec dictum non metus a porta. Etiam in tortor velit.

      Nunc ut imperdiet dui, et gravida augue. Sed vehicula facilisis arcu, non dignissim sem condimentum sit amet. Integer finibus faucibus eros et aliquam. Sed nec accumsan mauris. Sed et diam lacinia, tincidunt urna vitae, placerat dolor. Duis lorem lacus, gravida nec gravida ac, dapibus eu sapien. Sed neque diam, gravida a nunc in, tincidunt tincidunt arcu. Pellentesque eu risus nec nunc tempus tincidunt in vel erat. Suspendisse dapibus ante tortor, vitae consequat libero euismod ac. Curabitur id velit nunc. Donec sit amet malesuada nibh. Cras vitae iaculis ex.

      Sed eget accumsan eros, a iaculis felis. Sed volutpat ligula vel accumsan mattis. Donec eleifend, nisi sit amet porttitor dictum, ex elit gravida urna, rhoncus mollis mauris nisl in mi. Donec cursus dapibus ex, non vulputate erat sollicitudin sed. Aenean ut eleifend leo. Quisque tristique turpis ipsum, nec malesuada augue sodales quis. Phasellus ultrices accumsan lorem hendrerit tristique. Cras sit amet rutrum nisl, vitae tempor felis. Praesent nibh dolor, dictum ut feugiat quis, rhoncus venenatis mauris. Aenean malesuada magna non ante viverra venenatis.

      Cras pellentesque rutrum ligula consequat suscipit. Cras tincidunt malesuada arcu, a tincidunt leo. Quisque aliquam metus semper magna suscipit, at fringilla ipsum posuere. Vestibulum nec nulla condimentum, scelerisque mi eu, laoreet orci. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras lacus metus, luctus nec arcu eu, placerat elementum turpis. Suspendisse blandit, nisi a pulvinar facilisis, nunc ante condimentum nisl, vel pretium tellus nulla ac justo. Nulla sed augue quam. Vestibulum pellentesque mattis ante, ac congue risus pellentesque sed. Maecenas sit amet diam sed magna aliquam aliquam.

      Curabitur commodo sit amet augue vitae facilisis. Quisque ullamcorper neque nec nunc faucibus, quis auctor felis tempor. Nulla risus orci, congue id magna eget, rutrum ullamcorper justo. Duis volutpat odio ex, nec egestas metus ornare auctor. Praesent vel enim sapien. Aenean accumsan interdum lorem. Aenean viverra ante est, sed faucibus metus euismod nec. Donec in suscipit nibh.

      Curabitur euismod cursus facilisis. Vestibulum vehicula orci sollicitudin, venenatis ipsum at, convallis ipsum. Praesent interdum erat vitae elit varius mattis. Nulla condimentum leo quis viverra molestie. Proin sollicitudin consequat euismod. Curabitur id quam condimentum, accumsan risus eget, mattis odio. Ut hendrerit id neque in fringilla. Vivamus nibh erat, feugiat ac mollis malesuada, tincidunt id massa. Nullam risus sapien, dignissim sit amet turpis a, viverra viverra ex. Duis commodo lobortis libero, id pellentesque nunc sollicitudin nec. Phasellus aliquet diam sed suscipit placerat. Donec ornare viverra arcu, non vulputate turpis pretium quis. Donec a porta quam. Curabitur maximus velit ac tempus pharetra. Suspendisse condimentum et enim sit amet porttitor.

      Vestibulum maximus lorem non ligula aliquet, eget iaculis dui sollicitudin. Duis sit amet consectetur ex. Sed feugiat eu nulla eu sollicitudin. Sed porta, ex nec semper sodales, eros felis rutrum elit, eu tempus nulla odio ut arcu. Suspendisse lacinia nisl magna, venenatis tempor dolor sollicitudin sit amet. Donec nec dui eu leo feugiat porta viverra ac tellus. Sed congue arcu convallis arcu convallis, eu accumsan lacus finibus. Integer tempus lobortis dui, non iaculis dolor elementum sit amet. Aliquam condimentum tempor leo, a pulvinar nisi imperdiet vel. Proin pellentesque turpis velit, et sagittis neque pellentesque in. Integer porta nec leo sit amet placerat. Curabitur sit amet tortor enim. Nulla facilisi. Donec tincidunt pretium magna, eget mollis tellus mollis eu.

      Cras vehicula, leo eu interdum tempus, nisi sapien posuere massa, nec porta enim risus semper quam. Nullam lobortis porta sapien, ac euismod quam rhoncus a. Proin pulvinar turpis quis nisl semper, non ultrices enim imperdiet. Donec sodales augue eget tristique elementum. Sed vel dapibus nisi. Vestibulum hendrerit lacus turpis, sit amet pulvinar nibh imperdiet sit amet. Nullam consectetur mauris sit amet dapibus iaculis. Nulla fringilla eros eu lectus lacinia, auctor tempor orci mattis. Proin malesuada lectus in fermentum euismod. Etiam luctus cursus leo, vel semper quam consequat id. Vivamus congue nibh a porta malesuada. Curabitur nec mauris eu metus iaculis accumsan ut vitae nisi.

      Suspendisse et ligula nec augue pretium venenatis. Cras quis purus quis lacus scelerisque congue in eu augue. Duis id massa efficitur, sagittis sem vitae, ultricies erat. Mauris quis quam nibh. Sed dictum, ex eu interdum blandit, erat nibh convallis massa, eget mattis sem odio in nulla. Ut aliquet placerat turpis, non feugiat velit fermentum at. Nam auctor faucibus dictum. Cras blandit nulla in neque tincidunt sagittis. Vivamus ut tristique risus. In venenatis mauris tellus, ac mollis ipsum porta ac. In tempus vitae diam sed interdum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu aliquam elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque id orci diam. Cras sed felis sit amet eros rhoncus pellentesque a quis neque.

      Quisque rhoncus libero at odio pellentesque consequat a eu odio. Duis condimentum molestie velit vitae malesuada. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed a fermentum turpis, at cursus sem. Maecenas pretium imperdiet felis, ac faucibus augue vestibulum vel. Quisque quis dui elit. Donec egestas ligula eu tristique luctus. Aliquam erat volutpat. Nam at condimentum lacus. In erat tellus, vestibulum quis gravida ut, condimentum id mauris. Aliquam maximus viverra pellentesque. Donec non dolor non metus venenatis convallis. Integer sit amet turpis id nulla hendrerit tempus at et elit. Duis non dolor felis. Quisque feugiat mi ipsum, id molestie metus convallis in. Proin egestas semper rhoncus.

      Aliquam erat volutpat. Curabitur fringilla orci sed suscipit sagittis. Sed quis nunc et neque aliquet iaculis. Nam ipsum leo, vulputate ut consequat id, mattis vitae ante. Nullam molestie semper lectus in lacinia. Quisque felis diam, placerat ac sapien ut, condimentum mollis tellus. Aliquam fermentum ac metus et fermentum. Curabitur ut pulvinar nunc. Fusce vitae sodales ligula. Donec consectetur urna pellentesque congue molestie. Ut eget urna congue, rutrum mi eget, luctus ligula. Nullam non sagittis metus. Duis tempor ex ante, ac suscipit dolor interdum a. Phasellus quis sem convallis, lobortis tortor id, vehicula justo. Duis urna nibh, tristique eget sem sed, convallis blandit ante.

      Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent efficitur vel nunc at convallis. Nam pellentesque orci ut augue ultrices tempus. Sed dui sem, maximus eu sagittis quis, ornare id risus. Cras commodo iaculis egestas. In eu risus ultrices, faucibus nisi non, pretium enim. Duis sodales, dolor convallis tincidunt finibus, velit magna tempor risus, vel bibendum turpis nisl at nibh. Suspendisse eget commodo lorem, quis aliquam sem. Aliquam ut egestas odio. Ut semper commodo eros, non euismod erat malesuada non. Curabitur eu consectetur nibh, a feugiat erat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Lorem ipsum dolor sit amet, consectetur adipiscing elit. In purus libero, ornare ac tellus vitae, sagittis auctor orci. Quisque porta risus vitae nibh elementum congue. Nam neque orci, auctor molestie iaculis vehicula, placerat eget neque.

      Nullam tristique ultrices gravida. In sed rhoncus lacus. Duis pellentesque elementum auctor. Vestibulum pharetra ultricies libero ac lacinia. Nunc vehicula nulla at neque aliquet tempus. Donec a est turpis. Sed iaculis, sem quis blandit varius, elit dolor tincidunt mi, nec auctor sapien magna eu augue.

      Integer tortor nunc, tempus vel sollicitudin ut, gravida eu neque. Fusce euismod varius erat tincidunt varius. In vehicula dictum sodales. Suspendisse tincidunt auctor mi eu vehicula. Vestibulum faucibus dolor nec turpis faucibus blandit. Integer tincidunt dignissim ex, sed feugiat nunc ornare eget. Donec ante ex, dictum a condimentum vel, euismod quis lorem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus tempor nisi eu facilisis sagittis. Pellentesque facilisis tempus felis, eget consectetur leo bibendum ac. Cras pharetra quam eget nisi vulputate sagittis. Phasellus tincidunt ut enim id elementum. Phasellus mauris dolor, lobortis at dolor vitae, gravida venenatis elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed non enim a sem bibendum ornare. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.

      Proin lobortis metus vel est tempus, a interdum quam viverra. Cras id risus quis est mollis interdum. Etiam at ligula vitae velit efficitur tempor. Nam consectetur est quis enim tempus maximus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Proin accumsan ullamcorper neque, sit amet pharetra sapien vehicula sed. Duis dolor urna, porttitor id auctor sed, aliquet sit amet velit. Donec molestie orci erat, at dictum neque interdum ac. Mauris velit nunc, posuere vitae urna vel, cursus sodales odio. Sed semper, ligula et sollicitudin elementum, purus dolor eleifend metus, ut luctus nunc justo sed ex.

      Sed semper, erat sed gravida ornare, odio tortor dictum risus, quis iaculis justo ante sed odio. Nullam ut velit nisi. Ut tincidunt congue mattis. Nulla nec ornare libero. Suspendisse finibus egestas tristique. Quisque cursus dapibus consectetur. Aenean est est, rutrum vitae felis ut, blandit rhoncus dolor. Nam vel augue ac diam laoreet iaculis. Fusce imperdiet purus diam, id gravida nisl mollis gravida. Morbi sit amet tellus massa. Nam eu quam sagittis arcu dapibus consectetur non laoreet felis. Sed ornare at enim id dignissim. Fusce eleifend placerat ante, ut congue purus sagittis eget. Nullam condimentum lorem dignissim est condimentum pulvinar. Aenean tincidunt sagittis tincidunt.

      Nullam vitae velit nibh. Cras ut neque ac ligula gravida commodo in id lorem. Nam pharetra rutrum iaculis. Proin malesuada ultrices magna at finibus. Vestibulum euismod dui sit amet felis sollicitudin, at maximus massa finibus. Praesent sapien tortor, efficitur a tincidunt ut, scelerisque sed turpis. Praesent at nibh tincidunt, auctor urna id, posuere nibh. Phasellus nulla nibh, aliquet at fringilla id, venenatis eu quam. Morbi tincidunt ligula tortor, sit amet porta augue efficitur et. Pellentesque dictum nisi ex, et dictum elit accumsan ut. Aenean fringilla iaculis lacus, non iaculis sem fermentum a. Vivamus interdum tellus quis dignissim scelerisque. Nunc mollis et dui id condimentum. Nunc eleifend est et mi eleifend semper. In eu vehicula ligula, vel fringilla nulla.
    </div>
  )
}

export default App;
