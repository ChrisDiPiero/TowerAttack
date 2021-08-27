import Phaser from 'phaser'

export default class Squirrel extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, group) {
    super(scene, x, y, 'squirrel');
  }

  squirrelType() {

  }
}

Phaser.GameObjects.GameObjectFactory.register('squirrel', function (x, y, group) {
  const squirrel = new Squirrel(this.scene, x, y, group);

  group.add(squirrel);
  //console.log(squirrel);

  this.displayList.add(squirrel);
  this.updateList.add(squirrel);
  }
);