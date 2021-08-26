import Phaser from 'phaser'

export default class Nuts extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'nut');
  }

  nutType() {

  }
}

Phaser.GameObjects.GameObjectFactory.register('nut', function (x, y) {
  const nut = new Squirrel(this.scene, x, y);

  this.displayList.add(nut);
  this.updateList.add(nut);
  }
);