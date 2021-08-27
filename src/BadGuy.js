import Phaser from 'phaser';

export default class BadGuy extends Phaser.GameObjects.PathFollower {
  constructor(scene, path, x, y, name) {
    super(scene, path, x, y, 'badGuy');
    this.alive = true;
    this.hp = 100;
    this.name = name;
  }
}

Phaser.GameObjects.GameObjectFactory.register('badGuy', function (path, x, y, name) {
  const badGuy = new BadGuy(this.scene, path, x, y, name);

  badGuyGroup.add(badGuy);

  badGuy.startFollow({
  duration: 10000,
  rotateToPath: true,
  verticalAdjust: true
  });

  this.displayList.add(badGuy);
  this.updateList.add(badGuy);
  }
);