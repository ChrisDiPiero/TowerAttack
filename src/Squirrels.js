import Phaser from 'phaser'

export default class Squirrel extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'squirrel');
  }

  squirrelType() {

  }
}

Phaser.GameObjects.GameObjectFactory.register('squirrel', function (x, y) {
  const squirrel = new Squirrel(this.scene, x, y);

  this.displayList.add(squirrel);
  this.updateList.add(squirrel);
  }
);