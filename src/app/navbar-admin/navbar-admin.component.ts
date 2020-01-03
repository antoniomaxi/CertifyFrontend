import { Component, OnInit, AfterViewInit } from '@angular/core';
import $ from 'jquery';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.css']
})

  export class NavbarAdminComponent implements AfterViewInit {
    title = 'app works!';
  
    ngAfterViewInit() {
      $('.nav a').on('click', function(){
        $('.nav').find('.active').removeClass('active');
        $(this).parent().addClass('active');
      });
  
      $('.dropdown').on('show.bs.dropdown', function(e){
        $(this).find('.dropdown-menu').first().stop(true, true).slideDown(300);
      });
  
      $('.dropdown').on('hide.bs.dropdown', function(e){
        $(this).find('.dropdown-menu').first().stop(true, true).slideUp(200);
      });
  
      $('.dropdown-menu li').on('click', function(){
        $(this).parent().parent().addClass('active');
      });
    }
  }
  
