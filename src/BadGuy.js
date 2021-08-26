import Phaser from 'phaser';
import HealthBar from './HealthBar.js'

export default class BadGuy extends Phaser.GameObjects.PathFollower {
  constructor(scene, path, x, y) {
    super(scene, path, x, y, 'badGuy');


  }


}

Phaser.GameObjects.GameObjectFactory.register('badGuy', function (path, x, y) {
  const badGuy = new BadGuy(this.scene, path, x, y);

  badGuy.startFollow({
  duration: 10000,
  rotateToPath: true,
  verticalAdjust: true
  });

  this.displayList.add(badGuy);
  this.updateList.add(badGuy);
  }
);