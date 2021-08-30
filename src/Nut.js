import Phaser from 'phaser'

export default class Nut extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'nut');
    this.setActive(true);
    this.setVisible(true);
    this.damage = 50;
  }

}

Phaser.GameObjects.GameObjectFactory.register('nut', function (x, y, target, group) {
  const nut = new Nut(this.scene, x, y, target, group);

  nut.target = target;
  group.add(nut);

  this.displayList.add(nut);
  this.updateList.add(nut);
  }
);