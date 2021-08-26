import Phaser from 'phaser'

export default class BadGuy extends Phaser.GameObjects.PathFollower {
  constructor(scene, path, x, y) {
    super(scene, path, x, y, 'badGuy');
  }

  badGuyType() {

  }

}

Phaser.GameObjects.GameObjectFactory.register('badGuy', function (path, x, y) {
  const badGuy = new BadGuy(this.scene, path, x, y);

  this.displayList.add(badGuy);
  this.updateList.add(badGuy);
  }
);