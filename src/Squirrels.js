import Phaser from 'phaser'

export default class Squirrel extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'squirrel');
  }
}

Phaser.GameObjects.GameObjectFactory.register('squirrel', function (x, y, group) {
  const squirrel = new Squirrel(this.scene, x, y, group);

  group.add(squirrel);

  this.displayList.add(squirrel);
  this.updateList.add(squirrel);
  }
);