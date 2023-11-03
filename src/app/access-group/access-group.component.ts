import {ScrollingModule} from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-access-group',
  templateUrl: './access-group.component.html',
  styleUrls: ['./access-group.component.scss'],
})
export class AccessGroupComponent {
  items = Array.from({ length: 100000 }).map((_, i) => `Item #${i}`);
  accessGroup: Array<{
    clicked: boolean;
    sAccessGroup: string;
    sAccessCodes: Array<string>;
    selected: boolean; // Add the 'selected' property
  }> ;

  constructor(
    public dialogRef: MatDialogRef<AccessGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.accessGroup = data.accessGroup; // Assign the accessGroup data from MAT_DIALOG_DATA1
  }

  selectedGroupIndex: number | null = null;

  // toggleAccessCodes(index: number) {
  //   this.accessGroup.forEach((group, i) => {
  //     if (i !== index) {
  //       group.clicked = false;
  //     }
  //   });
  //   this.accessGroup[index].selected = !this.accessGroup[index].selected;
  // }
  toggleAccessCodes(index: number) {
    this.accessGroup.forEach((group, i) => {
      if (i !== index) {
        group.selected = false;
      }
    });
    this.accessGroup[index].selected = !this.accessGroup[index].selected;
  }
}
