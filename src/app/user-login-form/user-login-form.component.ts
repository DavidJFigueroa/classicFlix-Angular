import {Component, OnInit, Input} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";
import {FetchApiDataService} from "../fetch-api-data.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
@Component({
  selector: "app-user-login-form",
  templateUrl: "./user-login-form.component.html",
  styleUrls: ["./user-login-form.component.scss"],
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = {Username: "", Password: ""};

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result) => {
        // Logic for a successful user login goes here! (To be implemented)
        this.dialogRef.close(); // This will close the modal on success!
        this.snackBar.open("Login successful", "OK", {
          duration: 2000,
        });
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", result.token);
        this.router.navigate(["movies"]);
      },
      (error) => {
        if (error.error && typeof error.error === "object") {
          // Log the error object
          console.error("Error object from server:", error.error);
        }
        this.snackBar.open("Login failed", "OK", {
          duration: 2000,
        });
      }
    );
  }
}
