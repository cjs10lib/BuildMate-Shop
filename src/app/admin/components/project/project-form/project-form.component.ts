import { ProjectService } from '@shared/services/project-service.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '@shared/services/alert.service';
import { ServiceCategoryService } from '@shared/services/service-category.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UploadService } from '@shared/services/upload.service';
import { Project } from '@shared/models/project.model';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ImageCompressService } from '@admin/services/image-compress.service';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnInit, OnDestroy {

  projectId: string;
  project: Project = {};

  step = 0;

  imageUrl = '../../../../assets/avatars/avatar3.png';
  fileToUpload: File[] = [];
  uploadError;
  isHovering: boolean;

  subscription: Subscription;
  imageSubscription: Subscription;

  constructor(private imageCompressService: ImageCompressService,
              public sanitizer: DomSanitizer,
              private alertService: AlertService,
              private projectService: ProjectService,
              private router: Router,
              private uploadService: UploadService,
              private route: ActivatedRoute) { }


  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id');

    if (this.projectId) {
      this.subscription = this.projectService.getProject(this.projectId).subscribe(project => {
        this.project = project;
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.imageSubscription) {
      this.imageSubscription.unsubscribe();
    }
  }

  async onSubmit() {
    const confirm = await this.alertService.confirmUpdate();
    if (confirm.value) {
      const project = await this.projectService.addProject(this.project);
      const projectId = (await project.project).id;
      const avatar = project.avatar;

      this.uploadService.pushUpload(this.fileToUpload, projectId, 'PROJECT', avatar);

      this.alertService.afterUpdateSuccess();
      this.router.navigate(['account', 'projects']);
    }
  }

  async onDelete() {
    const confirm = await this.alertService.confirmDelete();
    if (confirm.value) {
      await this.projectService.deleteProject(this.project, this.projectId);

      this.alertService.afterDeleteSuccess();
      this.router.navigate(['account', 'projects']);
    }
  }

  toggleHover($event: boolean) {
    this.isHovering = $event;
  }

  onImageChange(event) {
    try {
      const image: File = event.target.files[0];
      this.uploadError = null;

      if (image.size > 512000) {
        this.uploadError = 'File should not exceed 500KB';
        console.log('😢 File should not exceed 500KB');
        return;
      }

      this.imageSubscription = this.imageCompressService.imageResize(image).pipe(switchMap(_resized => {
        return this.imageCompressService.imageCompress(_resized);
      })).subscribe(_resized => {
        this.fileToUpload.push(new File([_resized], _resized.name));
        this.getImagePreview(this.fileToUpload[0]);
      });

    } catch (error) {
      this.uploadError = error.reason;
      console.log('😢 Oh no!', error);
    }
  }

  getImagePreview(file: File) {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imageUrl = reader.result.toString();
    };
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

}
