// Copyright (c) 2017 VMware, Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { NgForm } from '@angular/forms';
import { httpStatusCode, AlertType } from './shared.const';
import { MessageService } from '../global-message/message.service';
/**
 * To handle the error message body
 * 
 * @export
 * @returns {string}
 */
export const errorHandler = function (error: any): string {
    if (!error) {
        return "UNKNOWN_ERROR";
    }
    if (!(error.statusCode || error.status)) {
        //treat as string message
        return '' + error;
    } else {
        switch (error.statusCode || error.status) {
            case 400:
                return "BAD_REQUEST_ERROR";
            case 401:
                return "UNAUTHORIZED_ERROR";
            case 403:
                return "FORBIDDEN_ERROR";
            case 404:
                return "NOT_FOUND_ERROR";
            case 412:
                return "PRECONDITION_FAILED";
            case 409:
                return "CONFLICT_ERROR";
            case 500:
                return "SERVER_ERROR";
            default:
                return "UNKNOWN_ERROR";
        }
    }
}

/**
 * To check if form is empty
 */
export const isEmptyForm = function (ngForm: NgForm): boolean {
    if (ngForm && ngForm.form) {
        let values = ngForm.form.value;
        if (values) {
            for (var key in values) {
                if (values[key]) {
                    return false;
                }
            }
        }

    }

    return true;
}

/**
 * Hanlde the 401 and 403 code
 * 
 * If handled the 401 or 403, then return true otherwise false
 */
export const accessErrorHandler = function (error: any, msgService: MessageService): boolean {
    if (error && error.status && msgService) {
        if (error.status === httpStatusCode.Unauthorized) {
            msgService.announceAppLevelMessage(error.status, "UNAUTHORIZED_ERROR", AlertType.DANGER);
            return true;
        }
    }

    return false;
}

//Provide capability of reconstructing the query paramter
export const maintainUrlQueryParmas = function (uri: string, key: string, value: string): string {
    let re: RegExp = new RegExp("([?&])" + key + "=.*?(&|#|$)", "i");
    if (value === undefined) {
        if (uri.match(re)) {
            return uri.replace(re, '$1$2');
        } else {
            return uri;
        }
    } else {
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        } else {
            var hash = '';
            if (uri.indexOf('#') !== -1) {
                hash = uri.replace(/.*#/, '#');
                uri = uri.replace(/#.*/, '');
            }
            var separator = uri.indexOf('?') !== -1 ? "&" : "?";
            return uri + separator + key + "=" + value + hash;
        }
    }
}