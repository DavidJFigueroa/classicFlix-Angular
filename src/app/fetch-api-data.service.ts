import {Injectable} from "@angular/core";
import {catchError} from "rxjs/operators";
import {HttpClient, HttpHeaders, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {map} from "rxjs/operators";

//Declaring the api url that will provide data for the client app
const apiUrl = "https://myflix-database-api-9ba401fe0e70.herokuapp.com/";
@Injectable({
  providedIn: "root",
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}
  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + "users", userDetails)
      .pipe(catchError(this.handleError));
  }

  userLogin(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + "login", userDetails)
      .pipe(catchError(this.handleError));
  }

  getAllMovies(): Observable<any> {
    const token = localStorage.getItem("token");
    return this.http
      .get(apiUrl + "movies", {
        headers: new HttpHeaders({
          Authorization: "Bearer " + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem("token");
    return this.http
      .get(apiUrl + "movies/" + title, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  getDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem("token");
    return this.http
      .get(apiUrl + "directors/" + directorName, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem("token");
    return this.http
      .get(apiUrl + "genres/" + genreName, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  getUser(): Observable<any> {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    return this.http
      .get(apiUrl + "users/" + user.Username, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  getFavoriteMovies(): Observable<any> {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return this.http
      .get(apiUrl + "users/" + user.Username, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  addMovieToFavorites(movieID: string): Observable<any> {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    user.FavoriteMovies.push(movieID);
    localStorage.setItem("user", JSON.stringify(user));
    return this.http
      .post(apiUrl + "users/" + user.Username + "/movies/" + movieID, movieID, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  removeMovieFromFavorites(movieID: string): Observable<any> {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const index = user.FavoriteMovies.indexOf(movieID);
    console.log(index);
    if (index > -1) {
      // only splice array when item is found
      user.FavoriteMovies.splice(index, 1); // 2nd parameter means remove one item only
    }
    localStorage.setItem("user", JSON.stringify(user));
    return this.http
      .delete(apiUrl + "users/" + user.Username + "/movies/" + movieID, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  isFavoriteMovie(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.FavoriteMovies.indexOf(movieId) >= 0;
  }

  editUser(updatedUser: any): Observable<any> {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return this.http
      .put(apiUrl + "users/" + user.Username, updatedUser, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  deleteUser(): Observable<any> {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return this.http
      .delete(apiUrl + "users/" + user.Username, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error("Some error occurred:", error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError("Something bad happened; please try again later.");
  }
}
